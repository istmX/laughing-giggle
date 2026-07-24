from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
from app.prompts.question_prompt import buildQuestionPrompt
import os
import json
from loguru import logger

# --- State Definition ---
class WizardState(TypedDict):
    idea_prompt: str
    rag_context: str
    generated_questions: List[str]
    messages: Annotated[list, "messages"]

# --- Node Functions ---
def generate_questions(state: WizardState) -> Dict[str, Any]:
    """
    Takes the user's idea and retrieved RAG context to generate adaptive flaw-finding questions.
    """
    logger.info("Running PM Wizard Graph: Generating Adaptive Flaw-Finding Questions")
    
    llm = get_fallback_llm()
    idea = state['idea_prompt']
    
    system_prompt = buildQuestionPrompt(idea)

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Idea to analyze: {idea}\n\nRetrieved Context:\n{state.get('rag_context', '')}")
    ]
    
    response = llm.invoke(messages)
    
    try:
        raw_text = response.content.replace('```json', '').replace('```', '').strip()
        start_idx = raw_text.find('{')
        end_idx = raw_text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            raw_text = raw_text[start_idx:end_idx+1]
        data = json.loads(raw_text)
        
        raw_qs = data.get("questions", [])
        if isinstance(raw_qs, list):
            questions = [q["title"] if isinstance(q, dict) and "title" in q else str(q) for q in raw_qs]
        else:
            questions = []
            
        if not questions:
            raise ValueError("No questions parsed")
            
    except Exception as e:
        logger.error(f"Failed to parse questions: {e}")
        questions = [
            "What core features or services does your application specialize in?",
            "What visual theme, color palette, and layout aesthetic do you prefer?",
            "What specific user journeys or interactive showcases should be highlighted?"
        ]

    return {"generated_questions": questions}


# --- Graph Construction ---
def build_pm_wizard_graph() -> StateGraph:
    """Builds and compiles the PM Wizard LangGraph."""
    graph_builder = StateGraph(WizardState)
    graph_builder.add_node("generate_questions", generate_questions)
    graph_builder.add_edge(START, "generate_questions")
    graph_builder.add_edge("generate_questions", END)
    return graph_builder.compile()

pm_wizard_graph = build_pm_wizard_graph()
