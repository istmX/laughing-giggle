from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
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
    Takes the user's idea and retrieved RAG context to generate domain-accurate clarification questions.
    """
    logger.info("Running PM Wizard Graph: Generating Questions")
    
    llm = get_fallback_llm()
    idea = state['idea_prompt']
    
    system_prompt = f"""ROLE:
You are Zenix, a premier Software Product Architect and Technical Product Manager.
Your goal is to analyze the user's initial software idea and draft exactly 3 highly relevant clarification questions.

Use the following Zenix architectural guidelines and UI knowledge:
{state['rag_context']}

CRITICAL DOMAIN & QUESTION RULES:
1. CHECK PROJECT INTENT FIRST:
   - If the idea is a **Portfolio, Agency Showcase, Landing Page, or Visual Website**:
     * **STRICT PROHIBITION**: NEVER ask database management questions (e.g., PostgreSQL vs MongoDB vs MySQL vs DynamoDB), server authentication, or websockets!
     * **MUST ASK** relevant content & design questions instead:
       - For Agency Portfolio: Ask about agency specialization (Branding & UI/UX, Full-Stack Web Dev, 3D & Motion), hero value proposition headline, or featured case studies layout.
       - For Developer Portfolio: Ask about top technical skills/languages to highlight (React, Next.js, Node.js, Python, Rust), featured GitHub projects, or visual style (Dark IDE/terminal vs minimalist editorial).
   - If the idea is a **Mobile App**: Ask about mobile navigation, offline support, or touch interactions.
   - Ask database/backend questions ONLY if the user is explicitly building a **Full-Stack SaaS / Platform** requiring a backend database.

2. BE SPECIFIC & HIGH-VALUE:
   - Each question must help refine the project context for AI coding agents.
   - Keep questions focused so they can easily be answered via 3 clear, diverse multiple-choice options plus "Let Zenix decide".

OUTPUT FORMAT:
- Output ONLY a raw JSON array of 3 strings. Do not use markdown blocks (no ```json). Do not output explanation.
- Example for Portfolio:
["What does your agency or personal brand specialize in (e.g., Branding & UI/UX, Full-Stack Web Development, or 3D & Motion Design)?", "What is the primary visual layout style you prefer (e.g., Dark Terminal/IDE style, Sleek Minimalist Editorial, or Dynamic Bento Grid)?", "Which key projects or case studies do you want featured on the hero section?"]
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Here is my idea: {idea}")
    ]
    
    response = llm.invoke(messages)
    
    try:
        raw_text = response.content.replace('```json', '').replace('```', '').strip()
        start_idx = raw_text.find('[')
        end_idx = raw_text.rfind(']')
        if start_idx != -1 and end_idx != -1:
            raw_text = raw_text[start_idx:end_idx+1]
        questions = json.loads(raw_text)
    except Exception as e:
        logger.error(f"Failed to parse questions: {e}")
        questions = [
            "What does your agency or personal brand specialize in?",
            "What visual theme and layout style do you prefer for the showcase?",
            "Which key projects or skills would you like featured on the hero section?"
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
