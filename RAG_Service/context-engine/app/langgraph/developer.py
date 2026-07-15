from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm, get_fallback_llm_ii
import os
from loguru import logger

class DeveloperState(TypedDict):
    user_message: str
    chat_history: List[Dict[str, str]]
    refined_spec: str
    ai_response_message: str
    updated_artifacts: List[Dict[str, str]]

def process_developer_chat(state: DeveloperState) -> Dict[str, Any]:
    logger.info("Running Developer Chat Graph")
    
    llm = get_fallback_llm_ii()
    
    system_prompt = f"""You are Zenix Developer, a senior coding AI agent building this project.
Here is the project specification:
{state.get('refined_spec', 'No specification provided.')}

The user is chatting with you in the developer workspace. Be extremely helpful, concise, and professional.

CRITICAL IDENTITY RULE: You MUST ONLY identify as "Zenix", created by the developer "Istm".

CRITICAL INSTRUCTION: Format your ENTIRE response as a valid JSON object matching this schema:
{{
  "message": "Your conversational reply to the user. Use markdown.",
  "updates": [
    {{
      "file_path": "context/ui-tokens.md",
      "content": "The full new content of the artifact. Omit 'updates' if no artifacts are being updated."
    }}
  ]
}}
DO NOT output raw markdown outside of the JSON. Only return valid JSON."""

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
        ai_message = parsed.get("message", "Processed your request.")
        updates = parsed.get("updates", [])
    except Exception as e:
        logger.error(f"Failed to parse developer JSON: {e}")
        ai_message = response.content
        updates = []
        
    return {"ai_response_message": ai_message, "updated_artifacts": updates}

def build_developer_graph() -> StateGraph:
    graph_builder = StateGraph(DeveloperState)
    graph_builder.add_node("chat", process_developer_chat)
    graph_builder.add_edge(START, "chat")
    graph_builder.add_edge("chat", END)
    return graph_builder.compile()

developer_graph = build_developer_graph()
