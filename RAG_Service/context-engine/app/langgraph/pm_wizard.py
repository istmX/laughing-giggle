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
    history: List[Dict[str, str]]
    next_question: str
    options: List[str]
    is_complete: bool

def generate_questions(state: WizardState) -> Dict[str, Any]:
    """
    Evaluates original idea + conversation history to generate the SINGLE next best question dynamically.
    """
    logger.info("Running PM Wizard Graph: Generating Next Reactive Question")
    
    llm = get_fallback_llm()
    idea = state['idea_prompt']
    history = state.get('history', [])
    
    # Check for Smart Fast-Forward: If user selected "Let Zenix decide" 2 times in a row, finish wizard immediately
    consecutive_zenix = 0
    for qa in reversed(history):
        ans = qa.get('answer', '').strip().lower()
        if 'let zenix decide' in ans:
            consecutive_zenix += 1
        else:
            break
            
    if consecutive_zenix >= 2:
        logger.info(f"Smart Fast-Forward triggered ({consecutive_zenix} consecutive 'Let Zenix decide' answers). Completing wizard.")
        return {
            "next_question": "",
            "options": [],
            "is_complete": True
        }

    qa_formatted = "\n".join([f"Q: {qa.get('question', '')}\nA: {qa.get('answer', '')}" for qa in history])

    
    system_prompt = f"""You are Zenix, a Senior Staff Technical Architect and Product Manager.
Analyze the user's software idea: "{idea}"

CURRENT CONVERSATION HISTORY SO FAR:
{qa_formatted if qa_formatted else "(No questions answered yet. This is the first turn.)"}

REACTIVE EVALUATION RULES:
1. CONTEXT AWARENESS & NO REPETITION:
   - Read what the user stated in their initial prompt and previous Q&A answers.
   - If the initial prompt already describes the core application feature/workflow (e.g. "flashcards, quizzes, and notes using Gemini API"), DO NOT ask "What is the primary feature or workflow?".
   - Instead, ask specific, high-value feature/design questions (e.g. "How should flashcard study sessions be structured?" or "What level of user authentication do you prefer?").

2. DOMAIN BOUNDARIES:
   - Full-Stack SaaS / Platform: Require authentication (Email/Password + Google OAuth) and database preferences.
   - Portfolio / Visual Showcase: Strictly BAN database/auth questions! Ask about visual theme, skills, or hero text.

3. DECIDE NEXT TURN:
   - If all essential requirements to build the app specification are clear (or 2-3 turns answered), set `"is_complete": true`.
   - Otherwise, generate ONE clear, focused next question with 2 relevant, project-specific choice options + "Let Zenix decide".

OUTPUT FORMAT (STRICT JSON ONLY - No markdown):
{{
  "is_complete": false,
  "next_question": "string (the single clear next question)",
  "options": ["Option 1", "Option 2", "Let Zenix decide"]
}}
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content="Evaluate history and return the next question or completion state.")
    ]
    
    response = llm.invoke(messages)
    
    try:
        raw_text = response.content.replace('```json', '').replace('```', '').strip()
        start_idx = raw_text.find('{')
        end_idx = raw_text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            raw_text = raw_text[start_idx:end_idx+1]
        data = json.loads(raw_text)
        
        is_complete = data.get("is_complete", False)
        next_q = data.get("next_question", "What specific user customization features would you like to prioritize?")
        opts = data.get("options", ["Custom Preferences", "Standard Defaults", "Let Zenix decide"])

        
        if "Let Zenix decide" not in opts:
            opts.append("Let Zenix decide")
            
        return {
            "next_question": next_q,
            "options": opts,
            "is_complete": is_complete
        }
    except Exception as e:
        logger.error(f"Failed to parse next question: {e}")
        return {
            "next_question": "What is the primary feature or workflow of your application?",
            "options": ["Core Application Workflow", "Custom Feature Set", "Let Zenix decide"],
            "is_complete": False
        }



# --- Graph Construction ---
def build_pm_wizard_graph() -> StateGraph:
    """Builds and compiles the PM Wizard LangGraph."""
    graph_builder = StateGraph(WizardState)
    graph_builder.add_node("generate_questions", generate_questions)
    graph_builder.add_edge(START, "generate_questions")
    graph_builder.add_edge("generate_questions", END)
    return graph_builder.compile()

pm_wizard_graph = build_pm_wizard_graph()
