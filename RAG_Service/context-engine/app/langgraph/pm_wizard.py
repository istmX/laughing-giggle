from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
import os
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
    Takes the user's idea and the retrieved RAG context, and uses the LLM
    to generate highly specific clarification questions.
    """
    logger.info("Running PM Wizard Graph: Generating Questions")
    
    llm = get_fallback_llm()
    
    system_prompt = f"""You are Zenix, an expert Software Product Manager.
Your job is to read the user's initial software idea and ask 3 highly specific, technical, 
and design-oriented clarification questions.

Use the following Zenix architectural rules and UI knowledge to inform your questions:
{state['rag_context']}

CRITICAL INSTRUCTIONS:
- Do not ask generic questions like "Who is the target audience?".
- Ask about specific technology stacks, color choices, or layout decisions referenced in the UI knowledge.
- Output ONLY a raw JSON array of strings containing the questions. Do not use markdown wrapping.
Example:
["Question 1?", "Question 2?", "Question 3?"]
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Here is my idea: {state['idea_prompt']}")
    ]
    
    response = llm.invoke(messages)
    
    # Parse the response into a list
    import json
    try:
        raw_text = response.content.replace('```json', '').replace('```', '').strip()
        questions = json.loads(raw_text)
    except Exception as e:
        logger.error(f"Failed to parse questions: {e}")
        questions = ["Could you provide more details about your preferred tech stack?",
                     "What kind of visual theme are you imagining for this?",
                     "Are there any specific features you need built first?"]

    return {"generated_questions": questions}

# --- Graph Construction ---
def build_pm_wizard_graph() -> StateGraph:
    """Builds and compiles the PM Wizard LangGraph."""
    graph_builder = StateGraph(WizardState)
    
    graph_builder.add_node("generate_questions", generate_questions)
    
    graph_builder.add_edge(START, "generate_questions")
    graph_builder.add_edge("generate_questions", END)
    
    return graph_builder.compile()

# Instantiate the compiled graph so it can be imported
pm_wizard_graph = build_pm_wizard_graph()
