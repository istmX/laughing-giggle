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
    
    system_prompt = f"""You are Zenix, a world-class Staff Software Architect and Principal Design Systems Engineer.
Your mission is to generate the absolute highest-fidelity, complete, and implementation-ready engineering markdown file for the target: "{state['target_file_path']}".

We are architecting a project based on this finalized specification and user requirements:
--- SPECIFICATION ---
{state['refined_spec']}
---------------------

Your output MUST be a complete, production-grade markdown document. Do not summarize, do not use placeholder text, do not write "TODO", and do not leave sections blank. Every single module, feature, block, and list item must be fully fleshed out with exhaustive technical descriptions.

--- ARCHITECTURAL RULES & UI KNOWLEDGE ---
{state['rag_context']}

--- REFERENCE TEMPLATE & BOUNDARY BLUEPRINT ---
{state['reference_template']}
----------------------------------------------

Follow these file-specific design and architecture instructions with meticulous detail:

1. IF GENERATING "agents.md" (OR ".cursorrules" / "GEMINI.md"):
   - Define the absolute source of truth for the AI coding agents.
   - Include the playful/human mascot identity of the project (e.g., screenshot memory journal rules).
   - Write out complete code standards: file-size target limits (<200 lines for components, <300 screens, <250 stores), strict naming conventions (PascalCase, camelCase, file extensions), component layout guidelines, state management guidelines (Zustand), async query patterns (TanStack Query), and safe import sequencing rules.
   - List every single approved library in the whitelists (Expo, NativeWind, AsyncStorage, Clerk, Zod, etc.) with detailed rationales and documentation urls.
   - Write the entire implementation roadmap of all 13 build phases in chronological order. Each phase must contain clear goals, sequential sub-tasks, deliverables, and success validation criteria. Do not summarize or skip phases.

2. IF GENERATING "design.md":
   - Construct the entire visual system, token guidelines, and component specifications.
   - Document every single design system token: primary, surface background, peach/mint backgrounds, cream card surfaces, soft white backdrops, semantic success green, and danger coral colors with their exact Hex color codes.
   - Write the complete typography scale matrix (display-xl, display-lg, subhead, link, caption size metrics, weights, line heights, letter spacings) and outline fallback font substitutions.
   - Detail the spacing token values (XS: 4px to 3XL: 64px), border radii (xs: 2px to pill/full), drop shadow dimensions, and duration constants.
   - Include the visual rules: "The Scrapbook Test", layout densities, progressive disclosure rules, copy-writing voice instructions, and anti-pattern boundaries (no glassmorphism, no tiny icon grids, no default Material UI shadows).
   - Formulate the detailed component registry for buttons, tabs, inputs, headers, navigation tabs, illustrations, and responsive collapsing guidelines across viewports.

3. IF GENERATING "project-overview.md":
   - Detail the product vision statements, problem definition, solution description, target audience segment analysis, core conversational refinement routes, detailed screen wireframe architectures, and a chronological changelog ledger.

4. IF GENERATING "architecture.md":
   - Outline the standard folder tree configurations, backend Express modules, MongoDB/Mongoose schema models, groq-sdk models, offline/online synchronization rules, and API transaction layers.

CRITICAL FORMATTING RULES:
- Output ONLY valid markdown. Do not wrap the output in a markdown block envelope (i.e. do not use ```markdown ... ```). Start directly with the first heading.
- Maintain 100% structural fidelity to the reference template. Incorporate the RAG context and design details directly into the variables and sections.
- Make the output extremely detailed, technical, and verbose. Prefer long, detailed descriptions over short bullet lists.
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
    
    system_prompt = f"""You are Zenix QA-Engine, a highly strict Principal Quality Assurance Reviewer.
Your job is to run a rigorous audit on the generated markdown file: "{state['target_file_path']}"

We are verifying the file against:
- Finalized Specification: {state['refined_spec'][:1000]}...
- Reference Template: {state['reference_template'][:1000]}...

CRITICAL VERIFICATION CHECKLIST:
1. COMPLETE ROADMAP CHECK: If verifying "agents.md", does the draft outline all 13 build phases in complete detail? If any phase is summarized or omitted, reject it.
2. DESIGN SYSTEM CHECK: If verifying "design.md", does the draft contain the exact color tokens (Hex codes), spacing values, typography matrices, component registries, and layout guidelines? If it has summaries or is under 200 lines, reject it.
3. VISUAL RULES CHECK: Does the draft enforce the design principles, copywriting constraints, and anti-pattern guidelines?
4. TEMPLATE STRUCTURE: Does the draft match the header structure and organization of the reference template exactly?

If the draft passes all checks with absolute perfection and contains zero summaries, placeholders, or missing details, you MUST output exactly the word "APPROVED".
If there are any deficiencies, missing sections, summaries, or errors, output a detailed bulleted list of the exact problems that must be fixed. Do NOT include the word "APPROVED" in your feedback.
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
