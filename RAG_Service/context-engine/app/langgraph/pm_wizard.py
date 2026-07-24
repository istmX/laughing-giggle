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
1. DETAILED PROMPT HANDLING (INSTANT FAST-FORWARD):
   - Read the user's initial prompt. If the prompt is ALREADY highly detailed (specifying core workflows, tech stack preferences, target audience, or explicit feature requirements), set `"is_complete": true` IMMEDIATELY on Turn 1! Do NOT force extra questions if the user has already given full instructions.

2. CONTEXT AWARENESS & NO REPETITION:
   - If the prompt is short or missing key details, ask ONE high-value clarifying question relevant to their domain.
   - DO NOT repeat questions about features already explained in the prompt.

3. DOMAIN BOUNDARIES:
   - Full-Stack SaaS / Platform: Require authentication (Email/Password + Google OAuth) and database preferences.
   - Portfolio / Visual Showcase: Strictly BAN database/auth questions! Ask about visual theme, skills, or hero text.

4. DECIDE NEXT TURN:
   - If essential requirements are clear (or prompt was detailed), set `"is_complete": true`.
   - Otherwise, generate ONE clear, focused next question with 2 relevant choice options + "Let Zenix decide".


OUTPUT FORMAT (STRICT JSON ONLY - No markdown):
{{
  "is_complete": false,
  "next_question": "string (the single clear next question)",
  "options": ["Option 1", "Option 2", "Let Zenix decide"]
}}
"""

    # Attempt 1: Invocation & Parsing
    for attempt in range(2):
        try:
            if attempt == 1:
                logger.warning("Retrying PM Wizard question generation with backup LLM...")
                backup_llm = get_load_balanced_llm(1)
                response = backup_llm.invoke(messages)
            
            raw = getattr(response, "content", response)
            if isinstance(raw, list):
                raw = "\n".join([str(item.get("text", item) if isinstance(item, dict) else item) for item in raw])
            raw_text = str(raw).replace('```json', '').replace('```', '').strip()

            start_idx = raw_text.find('{')
            end_idx = raw_text.rfind('}')
            if start_idx != -1 and end_idx != -1:
                raw_text = raw_text[start_idx:end_idx+1]
            data = json.loads(raw_text)
            
            is_complete = data.get("is_complete", False)
            next_q = data.get("next_question", "")
            opts = data.get("options", [])

            if not is_complete and not next_q:
                next_q = "What is the primary feature or workflow of your application?"
                opts = ["Core User Dashboard & Workflows", "Authentication & Database Setup", "Let Zenix decide"]

            if opts and "Let Zenix decide" not in opts:
                opts.append("Let Zenix decide")
                
            return {
                "next_question": next_q,
                "options": opts,
                "is_complete": is_complete,
                "error": False
            }
        except Exception as e:
            logger.error(f"Failed to parse next question (attempt {attempt + 1}): {e}")

    # Fallback response if all retries fail: return fallback question instead of empty completed state
    return {
        "next_question": "What is the primary feature or workflow of your application?",
        "options": ["Core User Dashboard & Workflows", "Authentication & Database Setup", "Let Zenix decide"],
        "is_complete": False,
        "error": True
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
