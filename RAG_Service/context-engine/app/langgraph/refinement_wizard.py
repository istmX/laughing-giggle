from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
import os
from loguru import logger

class RefinementState(TypedDict):
    idea_prompt: str
    questions_and_answers: List[Dict[str, str]]
    refined_spec: str

def refine_spec(state: RefinementState) -> Dict[str, Any]:
    logger.info("Running Refinement Graph: Synthesizing Specification")
    
    llm = get_fallback_llm()
    
    qa_text = "\n".join([f"Q: {qa['question']}\nA: {qa['answer']}" for qa in state['questions_and_answers']])
    
    system_prompt = """You are a Senior Technical Architect at Zenix.
Your task is to take a user's raw software idea and their answers to your clarifying questions, and synthesize them into a highly professional, comprehensive Technical Specification Document.

Do NOT add any placeholder text or conversational fluff. Just output the pure Markdown specification."""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Original Idea:\n{state['idea_prompt']}\n\nQ&A History:\n{qa_text}")
    ]
    
    response = llm.invoke(messages)
    
    return {"refined_spec": response.content.strip()}

def build_refinement_graph() -> StateGraph:
    graph_builder = StateGraph(RefinementState)
    graph_builder.add_node("refine", refine_spec)
    graph_builder.add_edge(START, "refine")
    graph_builder.add_edge("refine", END)
    return graph_builder.compile()

refinement_graph = build_refinement_graph()
