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
    
    system_prompt = f"""ROLE:
You are Zenix, a premier Software Product Architect and Technical Product Manager. 
Your goal is to analyze the user's initial software idea and draft exactly 3 highly specific, technical, and design-oriented clarification questions.

Use the following Zenix architectural guidelines and UI knowledge to inform your choices:
{state['rag_context']}

QUESTION QUALITY RULES:
1. NO GENERIC OR PRODUCT-LEVEL QUESTIONS:
   - NEVER ask questions like: "What is the primary feature?", "What features do you want?", "Who is the target audience?", "What is the timeline?", or "Do you have any other requirements?".
   - These are too generic. The user wants to build a technical plan and wants you to lead with specific engineering and architectural choices.
2. BE TECHNICAL AND ARCHITECTURAL:
   - Ask about database preferences, storage, real-time protocols, geolocation/APIs, authentication methods, or infrastructure options.
   - For example, if they want a location-based app, ask if they prefer PostgreSQL with PostGIS for geographical indexing, or MongoDB, or Supabase.
   - Ask about communication protocols (e.g., raw WebSockets, Socket.io, or Firebase Realtime database).
3. BE DESIGN-SYSTEM AND UI-ORIENTED:
   - Ask about visual aesthetics, layout style, density, themes, or custom styling vibes (e.g., flat monochrome, dark glassmorphism, sleek modern neo-brutalism, or minimal professional).
4. MUST HAVE 3 CONCRETE OPTIONS IN MIND:
   - Every question you ask should be answerable via 3 distinct options (since the UI will present them as 3 buttons). Keep the questions focused so that the next LLM step can easily generate 3 clear, diverse multiple-choice options.

OUTPUT FORMAT:
- Output ONLY a raw JSON array of 3 strings. Do not use markdown blocks (no ```json). Do not output explanation.
- Example:
["Do you prefer a Postgres database with PostGIS for geo-queries, or a document store like MongoDB?", "For the real-time chat sync, should we use raw WebSockets, Socket.io, or Firebase?", "What styling vibe should we apply for the dashboard (e.g., Dark Glassmorphism, Flat Monochrome, or Sleek Modern)?"]
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
