from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
from app.prompts.task_prompt import buildTaskPrompt
from loguru import logger
import json

class TaskState(TypedDict):
    refined_spec: str
    rag_context: str
    tasks: List[Dict[str, Any]]

def generate_tasks(state: TaskState) -> Dict[str, Any]:
    logger.info("Running Task Engine: Generating tasks")
    llm = get_fallback_llm()
    
    system_prompt = buildTaskPrompt(state['refined_spec'])
    system_prompt += f"\n\n--- UI KNOWLEDGE & RULES ---\n{state['rag_context']}"
    system_prompt += "\n\nCRITICAL: Output ONLY valid JSON representing a list of tasks. No markdown wrapping."
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content="Please generate the tasks based on the project specification.")
    ]
    
    response = llm.invoke(messages)
    
    try:
        raw_text = response.content.replace('```json', '').replace('```', '').strip()
        tasks = json.loads(raw_text)
    except Exception as e:
        logger.error(f"Failed to parse tasks: {e}")
        tasks = []
        
    return {"tasks": tasks}

def build_task_engine_graph() -> StateGraph:
    graph_builder = StateGraph(TaskState)
    graph_builder.add_node("generate_tasks", generate_tasks)
    graph_builder.add_edge(START, "generate_tasks")
    graph_builder.add_edge("generate_tasks", END)
    return graph_builder.compile()

task_engine_graph = build_task_engine_graph()
