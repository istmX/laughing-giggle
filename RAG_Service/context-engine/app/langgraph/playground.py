from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm, get_fallback_llm_ii
import os
from loguru import logger

class PlaygroundState(TypedDict):
    user_message: str
    chat_history: List[Dict[str, str]]
    ai_response: str
    generated_html: str

def process_playground_chat(state: PlaygroundState) -> Dict[str, Any]:
    logger.info("Running AI Playground Service")
    llm = get_fallback_llm_ii()    
    system_prompt = """You are Zenix Design AI, specifically operating in the Zenix AI Playground.
Your goal is to help the user iterate on a Design System (`DESIGN.md`). 
You must output a conversational response AND provide a full HTML/Tailwind CSS preview of the design system.

CRITICAL INSTRUCTION: Output your response as a valid JSON object:
{
  "message": "Your conversational reply...",
  "html": "<div class='bg-black text-white p-4'>Your tailwind HTML preview here</div>"
}
"""
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in state.get('chat_history', [])])
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"History:\n{history_text}\n\nUser: {state['user_message']}")
    ]
    
    response = llm.invoke(messages)
    import json
    try:
        content = response.content.replace('```json', '').replace('```', '').strip()
        parsed = json.loads(content)
        ai_message = parsed.get("message", "Here is your design.")
        html = parsed.get("html", "")
    except Exception as e:
        ai_message = response.content
        html = ""
        
    return {"ai_response": ai_message, "generated_html": html}

def build_playground_graph() -> StateGraph:
    graph_builder = StateGraph(PlaygroundState)
    graph_builder.add_node("chat", process_playground_chat)
    graph_builder.add_edge(START, "chat")
    graph_builder.add_edge("chat", END)
    return graph_builder.compile()

playground_graph = build_playground_graph()
