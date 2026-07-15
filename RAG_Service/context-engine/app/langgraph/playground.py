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

CRITICAL INSTRUCTIONS FOR YOUR CONVERSATIONAL RESPONSE:
- DO NOT just blindly say "Yes" to every user request.
- If the user asks for a design change that is objectively bad (e.g., terrible color contrast, outdated trends, clashing font pairings), you MUST critique them, push back, and suggest a better alternative. 
- Act as a senior design partner giving honest advice, not just a subservient assistant.
- Keep your messages conversational, insightful, and concise.

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

Update the designTokens based on the user's request. Always include the full designTokens object in your response.
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
