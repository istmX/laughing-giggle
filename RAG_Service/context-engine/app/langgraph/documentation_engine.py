from typing import Annotated, Dict, Any
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
from app.prompts.documentation_prompt import buildDocumentationPrompt
from loguru import logger

class DocumentationState(TypedDict):
    refined_spec: str
    rag_context: str
    doc_type: str
    documentation: str

def generate_documentation(state: DocumentationState) -> Dict[str, Any]:
    logger.info(f"Running Documentation Engine: Generating {state.get('doc_type', 'README.md')}")
    llm = get_fallback_llm()
    
    doc_type = state.get("doc_type", "README.md")
    system_prompt = buildDocumentationPrompt(doc_type)
    system_prompt += f"\n\n--- PROJECT SPEC ---\n{state['refined_spec']}"
    system_prompt += f"\n\n--- UI KNOWLEDGE & RULES ---\n{state['rag_context']}"
    
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content="Please generate the documentation.")
    ]
    
    response = llm.invoke(messages)
    content = response.content.strip()
    
    # Cleanup markdown wrapping if the LLM adds it
    if content.startswith("```markdown"):
        content = content[11:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
        
    return {"documentation": content.strip()}

def build_documentation_engine_graph() -> StateGraph:
    graph_builder = StateGraph(DocumentationState)
    graph_builder.add_node("generate_documentation", generate_documentation)
    graph_builder.add_edge(START, "generate_documentation")
    graph_builder.add_edge("generate_documentation", END)
    return graph_builder.compile()

documentation_engine_graph = build_documentation_engine_graph()
