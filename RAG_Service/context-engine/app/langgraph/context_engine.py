from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
import os
from loguru import logger

# --- State Definition ---
class ArtifactState(TypedDict):
    refined_spec: str
    rag_context: str
    target_file_path: str
    reference_template: str
    iterations: int
    draft_content: str
    verification_feedback: str
    is_approved: bool

def generate_draft(state: ArtifactState) -> Dict[str, Any]:
    """Generates the markdown artifact based on the spec and context."""
    logger.info(f"Iteration {state['iterations'] + 1}: Generating draft for {state['target_file_path']}")
    
    llm = get_fallback_llm()
    
    system_prompt = f"""You are an expert Software Architect for Zenix.
We are building a project based on this specification:
{state['refined_spec']}

Your task is to generate EXACTLY the contents for the file: "{state['target_file_path']}".

--- ARCHITECTURAL RULES & UI KNOWLEDGE ---
{state['rag_context']}

--- REFERENCE TEMPLATE ---
{state['reference_template']}
------------------------------------------------

CRITICAL RULES:
1. Do not output anything outside of the raw markdown for the file.
2. Follow the reference template structure perfectly.
3. Incorporate the provided UI/UX knowledge into your decisions.
"""

    # If there is feedback from a previous failed iteration, include it
    if state.get("verification_feedback"):
        system_prompt += f"\n\nCRITICAL FIXES NEEDED FROM PREVIOUS ATTEMPT:\n{state['verification_feedback']}"

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Please generate {state['target_file_path']}.")
    ]
    
    response = llm.invoke(messages)
    
    # Cleanup markdown wrapping
    content = response.content.strip()
    if content.startswith("```markdown"):
        content = content[11:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
        
    return {
        "draft_content": content.strip(),
        "iterations": state["iterations"] + 1
    }

def verify_draft(state: ArtifactState) -> Dict[str, Any]:
    """Checks the generated draft for missing requirements or inconsistencies."""
    logger.info(f"Verifying draft for {state['target_file_path']}")
    
    # If we hit the max iterations, force approval to prevent infinite loops
    if state["iterations"] >= 3:
        logger.warning(f"Max iterations reached for {state['target_file_path']}. Approving as-is.")
        return {"is_approved": True, "verification_feedback": ""}
        
    llm = get_fallback_llm()
    
    system_prompt = f"""You are a strict QA Reviewer for Zenix.
Review the following drafted file: "{state['target_file_path']}"

Original Spec: {state['refined_spec'][:500]}...
Reference Template: {state['reference_template'][:500]}...

Evaluate the draft based on:
1. Does it strictly follow the Reference Template structure?
2. Are there any missing requirements from the original spec?
3. Does it violate any Zenix rules?

If it is perfect, output EXACTLY the word "APPROVED".
If it needs fixes, output a bulleted list of the exact problems that must be fixed. Do NOT output the word "APPROVED".
"""
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"DRAFT CONTENT:\n{state['draft_content']}")
    ]
    
    response = llm.invoke(messages)
    feedback = response.content.strip()
    
    if "APPROVED" in feedback.upper():
        logger.success(f"{state['target_file_path']} was approved on iteration {state['iterations']}!")
        return {"is_approved": True, "verification_feedback": ""}
    else:
        logger.warning(f"{state['target_file_path']} failed verification. Routing back for fixes.")
        return {"is_approved": False, "verification_feedback": feedback}

def route_verification(state: ArtifactState) -> str:
    """Routing function to determine if we need another iteration."""
    if state["is_approved"]:
        return "approved"
    return "rejected"

# --- Graph Construction ---
def build_context_engine_graph() -> StateGraph:
    """Builds and compiles the 3-loop Context Engine LangGraph."""
    graph_builder = StateGraph(ArtifactState)
    
    graph_builder.add_node("generate", generate_draft)
    graph_builder.add_node("verify", verify_draft)
    
    graph_builder.add_edge(START, "generate")
    graph_builder.add_edge("generate", "verify")
    
    # Conditional Edge based on verification results
    graph_builder.add_conditional_edges(
        "verify",
        route_verification,
        {
            "approved": END,
            "rejected": "generate"  # Loop back to fix
        }
    )
    
    return graph_builder.compile()

context_engine_graph = build_context_engine_graph()
