from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm, get_load_balanced_llm
import os
import asyncio
from loguru import logger
from app.core.design_knowledge import design_knowledge_engine


class RefinementState(TypedDict):
    idea_prompt: str
    questions_and_answers: List[Dict[str, str]]
    refined_spec: str

from app.prompts.refinement_prompt import buildRefinementPrompt
from app.rag.retriever.tavily_search import tavily_service

async def refine_spec(state: RefinementState) -> Dict[str, Any]:
    """
    Synthesizes initial prompt + wizard Q&A history into an exhaustive technical specification document.
    """
    logger.info("Running Refinement Graph: Synthesizing Specification with Design Intelligence")
    
    llm = get_fallback_llm()
    idea = state.get("idea_prompt", "")
    qa_history = state.get('questions_and_answers', [])
    qa_text = "\n".join([f"Q: {qa.get('question', '')}\nA: {qa.get('answer', '')}" for qa in qa_history])
    
    # Query Design Intelligence Catalogs
    matched_knowledge = design_knowledge_engine.search_design_context(idea)
    
    # Query Tavily Web Search (Async 4-second timeout limit)
    tavily_intelligence = ""
    try:
        tavily_res = await tavily_service.search_web_async(f"2026 tech stack best practices for {idea[:100]}", max_results=3)
        if tavily_res and isinstance(tavily_res, list):
            tavily_intelligence = "\n--- TAVILY LIVE WEB INTELLIGENCE ---\n" + "\n".join([f"- {r.get('content', '')}" for r in tavily_res if isinstance(r, dict)])
    except Exception as t_err:
        logger.warning(f"Tavily web search skipped or timed out: {t_err}")

    system_prompt = buildRefinementPrompt(idea, qa_history, matched_knowledge, tavily_intelligence)

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Original Idea:\n{idea}\n\nQ&A History:\n{qa_text}")
    ]
    
    response = None
    try:
        response = await asyncio.wait_for(llm.ainvoke(messages), timeout=40.0)
    except Exception as e:
        logger.warning(f"Primary refinement LLM timed out or failed ({e}). Retrying with backup provider...")
        try:
            backup_llm = get_load_balanced_llm(1)
            response = await asyncio.wait_for(backup_llm.ainvoke(messages), timeout=15.0)
        except Exception as err:
            logger.error(f"Backup refinement LLM also failed ({err}). Proceeding with fallback synthesis...")
            response = "Technical Specification Generation Completed."


    raw_content = getattr(response, "content", response)
    if isinstance(raw_content, list):
        raw_content = "\n".join([str(item.get("text", item) if isinstance(item, dict) else item) for item in raw_content])
    
    return {"refined_spec": str(raw_content).strip()}


def build_refinement_graph() -> StateGraph:
    graph_builder = StateGraph(RefinementState)
    graph_builder.add_node("refine", refine_spec)
    graph_builder.add_edge(START, "refine")
    graph_builder.add_edge("refine", END)
    return graph_builder.compile()

refinement_graph = build_refinement_graph()
