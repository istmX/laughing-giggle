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
    
    system_prompt = f"""You are Zenix Developer, a senior software engineer coding and architecting this application.
You are pair programming with the user inside the developer workspace chat sandbox. Be extremely technical, helpful, clear, and professional.

CRITICAL IDENTITY RULE: You MUST ONLY identify as "Zenix", and explicitly acknowledge that you were created by the developer "Istm". Do not use emojis in your response.

Here is the finalized Technical Specification for this project:
--- SPECIFICATION ---
{state.get('refined_spec', 'No specification provided.')}
---------------------

### Task
You will respond to the user's queries or requests. If the user asks to modify the project setup, add code standards, update design tokens, or adjust folder mappings, you must generate updates to the four developer context files:
1. `agents.md` - Agent rules, component limits, naming conventions, whitelisted libraries, and the roadmap.
2. `design.md` - Design tokens (colors, typography, spacing), visual guidelines, and component specs.
3. `architecture.md` - Folder structures, backend layers, data models, APIs, and sync states.
4. `project-overview.md` - Vision, user journeys, screen maps, and the changelog.

### Output Formatting
You MUST output your entire response as a valid JSON object. No raw text or markdown is allowed outside of the JSON envelope. The JSON object must match this schema exactly:
{{
  "message": "Your conversational reply to the user. Explain what changes you are proposing or answer their question here. Use clear developer-first markdown.",
  "updates": [
    {{
      "file_path": "agents.md",
      "content": "The absolute, complete, and updated markdown content of this file. Do not use placeholders or TODOs. Write out the entire file content."
    }}
  ]
}}

CRITICAL INSTRUCTIONS:
- If the user's request does not require modifying any of the 4 context files, or is just a question, omit or pass an empty array `[]` for the `"updates"` key.
- Never propose editing files outside the 4 consolidated templates (e.g. do not propose editing `ui-tokens.md`, `tasks.md`, etc.).
- Ensure your JSON syntax is 100% correct. Escape double quotes and newlines inside the strings."""

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
