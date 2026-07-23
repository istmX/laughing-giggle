from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from app.core.llm import get_fallback_llm
import os
import asyncio
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

async def generate_draft(state: ArtifactState) -> Dict[str, Any]:
    """Generates the markdown artifact based on the spec and context."""
    logger.info(f"Iteration {state['iterations'] + 1}: Generating draft for {state['target_file_path']}")
    
    groq_api_key = os.getenv("GROQ_API_KEY_II") or os.getenv("GROQ_API_KEY")
    mistral_api_key = os.getenv("MISTRAL_API_KEY_II") or os.getenv("MISTRAL_API_KEY")
    
    primary_llm = ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_api_key)
    
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
   - Include the visual style guidelines and operating rules for the project based on the refined specification.
   - Write out complete code standards: file-size target limits (<150 lines for components, <300 screens, <250 stores), strict naming conventions (PascalCase, camelCase, file extensions), component layout guidelines, state management guidelines (e.g. Zustand, Redux, etc. as defined in the spec), and safe import sequencing rules.
   - List every single approved library in the whitelists matching the selected technology stack in the refined specification with detailed rationales and documentation urls.
   - Write the entire implementation roadmap of all chronological build phases. Each phase must contain clear goals, sequential sub-tasks, deliverables, and success validation criteria. Do not summarize or skip phases.

2. IF GENERATING "design.md":
   - Construct the entire visual system, token guidelines, and component specifications.
   - Document every single design system token: primary, surface background, card surfaces, border/hairline elements, and semantic state colors (success, danger, info) with their exact Hex color codes matching the theme and vibe in the refined specification.
   - Write the complete typography scale matrix (headings, body, links, caption size metrics, weights, line heights, letter spacings) and outline fallback font substitutions.
   - Detail the spacing token values (e.g. XS to 3XL scale), border radii (xs to pill/full), drop shadow dimensions, and duration constants.
   - Include the specific visual rules, progressive disclosure rules, copy-writing voice instructions, and anti-pattern boundaries matching the project's unique brand.
   - Formulate the detailed component registry for buttons, inputs, headers, navigation tabs, and responsive collapsing guidelines across desktop and mobile viewports.

3. IF GENERATING "project-overview.md":
   - Detail the product vision statements, problem definition, solution description, target audience segment analysis, core conversational refinement routes, detailed screen wireframe architectures, and a chronological changelog ledger.

4. IF GENERATING "architecture.md":
   - Outline the standard folder tree configurations, frontend/backend modules, database schema models, offline/online synchronization rules, and API transaction layers matching the refined specification.

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
    
    try:
        # 120s timeout per file generation call
        logger.info(f"Invoking primary model llama-3.1-8b-instant for {state['target_file_path']} with 120s timeout...")
        response = await asyncio.wait_for(primary_llm.ainvoke(messages), timeout=120.0)
    except Exception as e:
        logger.warning(f"Primary model failed or timed out for {state['target_file_path']}: {e}. Falling back to mistral-large-latest...")
        fallback_llm = ChatMistralAI(model="mistral-large-latest", api_key=mistral_api_key)
        response = await fallback_llm.ainvoke(messages)
    
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

async def verify_draft(state: ArtifactState) -> Dict[str, Any]:
    """Checks the generated draft for missing requirements or inconsistencies."""
    logger.info(f"Verifying draft for {state['target_file_path']}")
    
    # If we hit the max iterations, force approval to prevent infinite loops
    if state["iterations"] >= 3:
        logger.warning(f"Max iterations reached for {state['target_file_path']}. Approving as-is.")
        return {"is_approved": True, "verification_feedback": ""}
        
    groq_api_key = os.getenv("GROQ_API_KEY_II") or os.getenv("GROQ_API_KEY")
    llm = ChatGroq(model_name="llama-3.1-8b-instant", api_key=groq_api_key)
    
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
    
    try:
        response = await llm.ainvoke(messages)
        feedback = response.content.strip()
    except Exception as e:
        logger.error(f"Verification failed: {e}. Approving as-is.")
        feedback = "APPROVED"
    
    if "APPROVED" in feedback.upper():
        logger.success(f"{state['target_file_path']} was approved on iteration {state['iterations']}!")
        return {"is_approved": True, "verification_feedback": ""}
    else:
        logger.warning(f"{state['target_file_path']} failed verification. Routing back for fixes.")
        return {"is_approved": False, "verification_feedback": feedback}

# --- Graph Construction ---
def build_context_engine_graph() -> StateGraph:
    """Builds and compiles the 1-loop Context Engine LangGraph."""
    graph_builder = StateGraph(ArtifactState)
    
    graph_builder.add_node("generate", generate_draft)
    graph_builder.add_node("verify", verify_draft)
    
    graph_builder.add_edge(START, "generate")
    graph_builder.add_edge("generate", "verify")
    graph_builder.add_edge("verify", END)
    
    return graph_builder.compile()

context_engine_graph = build_context_engine_graph()
