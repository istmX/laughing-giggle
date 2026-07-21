from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm, get_fallback_llm_ii
import os
import json
from loguru import logger

class PlaygroundState(TypedDict):
    chat_history: List[Dict[str, str]]
    design_tokens: Dict[str, Any]
    ai_response: str

def process_playground_chat(state: PlaygroundState) -> Dict[str, Any]:
    logger.info("Running AI Playground Service with Design Tokens")
    llm = get_fallback_llm_ii()    
    
    current_tokens = json.dumps(state.get("design_tokens", {}), indent=2)
    
    system_prompt = f"""You are Zenix Design AI, an expert, opinionated senior product designer operating in the Zenix AI Playground.
Your goal is to help the user iterate on a Design System (`DESIGN.md`). 
Instead of writing HTML or CSS, you will update a structured JSON state representing the design tokens (colors, typography, animations, border radii).
The frontend uses this JSON to render a live preview.

CRITICAL INSTRUCTIONS FOR APPLYING USER REQUESTS:
- Treat the latest user message as a focused change request.
- Apply only the token fields explicitly requested or unambiguously required by that request.
- If the user asks to change a color, change only the relevant color token(s). Do not change typography, spacing, radius, animations, or unrelated colors.
- Preserve every existing token that is not in scope. Never reset the design system to defaults.
- Do not add unsolicited redesigns, alternatives, critiques, trend commentary, questions, or follow-up requests. Only mention a contrast/accessibility concern when the requested value would make the preview unusable; keep that warning to one short sentence.
- Complete the token update first, then return a concise result that says what changed.

CRITICAL INSTRUCTIONS FOR THE RESPONSE MESSAGE:
- Return at most one short acknowledgement followed by a maximum of three bullets.
- Each bullet must name an exact changed token path and its resulting value.
- If one field was requested, report one field. Do not list unchanged tokens.
- Do not describe the full design system in the conversational message; the full designTokens object is for state persistence only.

Here are the current design tokens:
{current_tokens}

CRITICAL INSTRUCTION: Output your response as a valid JSON object matching this schema exactly:
{{
  "message": "Your conversational reply to the user...",
  "designTokens": {{
    "themeName": "Name of the theme",
    "colors": {{
      "primary": "#hex",
      "canvas": "#hex",
      "surface": "#hex",
      "text": "#hex"
    }},
    "typography": {{
      "headingFont": "Font Name",
      "bodyFont": "Font Name"
    }},
    "radius": "8px",
    "animations": {{
      "engine": "gsap",
      "defaults": {{
        "ease": "power3.out",
        "duration": 0.8
      }},
      "entrances": {{
        "pageLoad": "fade-in slide-up"
      }}
    }}
  }}
}}

Update the designTokens based only on the user's request. Always include the full unchanged-or-updated designTokens object in the JSON response, but keep the conversational message limited to the requested changes.
"""
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in state.get('chat_history', [])])
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"History:\n{history_text}")
    ]
    
    response = llm.invoke(messages)
    try:
        content = response.content.replace('```json', '').replace('```', '').strip()
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1:
            content = content[start_idx:end_idx+1]
        parsed = json.loads(content)
        ai_message = parsed.get("message", "Here is your updated design.")
        new_tokens = parsed.get("designTokens", state.get("design_tokens", {}))
    except Exception as e:
        logger.error(f"Failed to parse JSON from AI: {e}")
        ai_message = response.content
        new_tokens = state.get("design_tokens", {})
        
    return {"ai_response": ai_message, "design_tokens": new_tokens}

def build_playground_graph() -> StateGraph:
    graph_builder = StateGraph(PlaygroundState)
    graph_builder.add_node("chat", process_playground_chat)
    graph_builder.add_edge(START, "chat")
    graph_builder.add_edge("chat", END)
    return graph_builder.compile()

playground_graph = build_playground_graph()
