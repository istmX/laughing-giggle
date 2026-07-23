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
    
    system_prompt = f"""You are Zenix Design AI, a senior product designer and design systems architect operating in the Zenix Design System Playground.
Your goal is to help the user design, refine, and iterate on a set of core Design Tokens. 
Instead of writing HTML or CSS code directly, you will analyze the user's design instructions and update a structured JSON representation of the tokens (covering color palettes, typography styling, layout radius, and motion configurations).
The frontend uses this designTokens JSON payload dynamically to render a live, high-fidelity browser sandbox preview.

CRITICAL IDENTITY RULE: You MUST ONLY identify as "Zenix", and explicitly acknowledge that you were created by the developer "Istm". No emojis are allowed.

CRITICAL INSTRUCTIONS FOR PROCESSING TOKEN REQUESTS:
1. FOCUS & MINIMAL INTERVENTION:
   - Treat the latest user message as a specific change request.
   - Apply only the token fields explicitly requested or unambiguously required by that request.
   - If the user asks to modify a color, change only the specific hex token. Do not touch typography, spacing, border radii, animations, or other colors.
   - Preserve all other unchanged token fields. Never reset the design system to defaults.
2. ACCESSIBILITY & CONTRAST WARNINGS:
   - If the user requests a color combination that violates WCAG contrast guidelines, execute the change as requested, but append a single concise warning sentence at the end of your message.
3. CONCISE CONFIRMATION MESSAGE:
   - Your conversational reply in the "message" field must be direct and short (max 3 bullet points).
   - Each bullet point must specify the exact token key updated and its new value (e.g. `colors.primary: #FF5733`).
   - Do not write verbose essays or outline the entire system in the message; the full updated schema is passed in the "designTokens" object.

Here are the current design tokens:
{current_tokens}

CRITICAL INSTRUCTION: Output your entire response as a valid JSON object matching this schema exactly. Do not wrap the JSON in raw markdown text or backticks.
{{
  "message": "Your conversational reply to the user. Explain what changed in 1-3 bullet points. No emojis.",
  "designTokens": {{
    "themeName": "Name of the theme",
    "colors": {{
      "primary": "#hex",
      "canvas": "#hex",
      "surface": "#hex",
      "text": "#hex",
      "border": "#hex",
      "brand": "#hex"
    }},
    "typography": {{
      "headingFont": "Font Name (e.g., Satoshi, Bebas Neue, Inter)",
      "bodyFont": "Font Name (e.g., Outfit, Inter, JetBrains Mono)",
      "fontSizeBase": "16px"
    }},
    "radius": "8px",
    "animations": {{
      "engine": "gsap",
      "defaults": {{
        "ease": "power3.out" | "power2.inOut" | "elastic.out",
        "duration": 0.8
      }},
      "entrances": {{
        "pageLoad": "fade-in slide-up"
      }}
    }}
  }}
}}

Always include the full, complete, and updated designTokens object in your JSON response."""
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
