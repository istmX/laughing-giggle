from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm, get_fallback_llm_ii
import os
import asyncio
from loguru import logger
from app.core.design_knowledge import design_knowledge_engine

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

BASE_KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge")

def get_template_for_target(target_file: str, spec: str) -> str:
    spec_lower = spec.lower()
    fname = os.path.basename(target_file)
    
    if any(k in spec_lower for k in ["portfolio", "agency", "showcase", "landing", "personal site", "developer showcase", "dev portfolio"]):
        template_folder = "portfolio"
    elif any(k in spec_lower for k in ["mobile", "expo", "react native", "ios", "android"]):
        template_folder = "mobile"
    else:
        template_folder = "saas"
        
    tpl_path = os.path.join(BASE_KNOWLEDGE_DIR, "context", template_folder, fname)
    if os.path.exists(tpl_path):
        try:
            with open(tpl_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error loading template {tpl_path}: {e}")
            
    # Fallback to root context file if available
    root_tpl = os.path.join(BASE_KNOWLEDGE_DIR, "context", fname)
    if os.path.exists(root_tpl):
        try:
            with open(root_tpl, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception:
            pass
            
    return ""

async def generate_draft(state: ArtifactState) -> Dict[str, Any]:
    """Generates high-fidelity markdown context artifacts matching the project category."""
    target_name = os.path.basename(state['target_file_path'])
    logger.info(f"Generating draft for {target_name}")
    
    spec = state.get('refined_spec', '')
    llm = get_fallback_llm_ii()
    
    matched_design_knowledge = design_knowledge_engine.search_design_context(spec)
    rag_context = f"{state.get('rag_context', '')}\n\n--- MATCHED DESIGN INTELLIGENCE & TOKENS ---\n{matched_design_knowledge}" if matched_design_knowledge else state.get('rag_context', '')
    
    reference_template = get_template_for_target(target_name, spec)

    system_prompt = f"""You are Zenix, a Staff Software Architect and Principal Design Systems Engineer (created by developer "Istm").
Your mission is to generate the highest-fidelity, complete, and implementation-ready markdown context file for: "{target_name}".

PROJECT SPECIFICATION & REQUIREMENTS:
--- SPECIFICATION ---
{spec}
---------------------

--- DESIGN INTELLIGENCE & ARCHITECTURE RULES ---
{rag_context}

--- REFERENCE TEMPLATE BLUEPRINT ---
{reference_template}
-----------------------------------

--- DOMAIN BOUNDARY & ARCHITECTURAL REASONING DIRECTIVES ---
1. DOMAIN ANALYSIS: Analyze the project specification and reference blueprint.
2. OVER-ENGINEERING PREVENTION:
   - If the project is a Portfolio, Landing Page, Developer Showcase, or Visual Site: DO NOT invent backend MongoDB schemas, Mongoose models, Express server controllers, Socket.io websockets, or Clerk authentication! Focus 100% on Next.js + TypeScript, Tailwind CSS, GSAP animations, responsive media grids, and design system tokens.
   - If the project is a Mobile App: Use Expo + React Native + TypeScript + NativeWind styling.
   - Only include database models and server authentication if the user's specification explicitly demands a full-stack backend SaaS platform.
3. TECH STACK SELECTION: Automatically choose modern tech stacks (Next.js + TypeScript + GSAP for Web, Expo + React Native for Mobile).

Follow these exact file-specific instructions:

1. IF GENERATING "agents.md" (OR ".cursorrules" / "GEMINI.md"):
   - Source of truth for AI agents. Set strict code standards: Component files <150 lines, screens <250 lines, stores <200 lines.
   - List whitelisted packages matching the project's chosen tech stack. Write out chronological build phases with sub-tasks and validation criteria.

2. IF GENERATING "design.md":
   - Complete visual design system specification.
   - Document hex colors (Primary, Canvas, Surface, Border, Secondary, Accent), typography scale matrix (display-xl, display-lg, headline, body, eyebrow font faces and metrics), corner radii, container max-widths, and spacing scales.
   - Detail GSAP motion rules (scroll triggers, stagger delays, ease functions) for interactive web sites.

3. IF GENERATING "architecture.md":
   - Complete folder tree structure matching the chosen tech stack.
   - Client component hierarchy, layout boundaries, and responsive breakpoints.
   - Include database schemas or REST API contracts ONLY if the project genuinely requires a backend.

4. IF GENERATING "project-overview.md":
   - Product vision, target audience, non-negotiable user journeys, wireframe screen specs, and core feature requirements.

CRITICAL FORMATTING:
- Output ONLY valid Markdown. Do not wrap in extra markdown block envelopes (no ```markdown).
- Make the document exhaustive, detailed, technical, and complete. Zero TODOs or blank sections.
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Please generate {target_name}.")
    ]
    
    try:
        logger.info(f"Invoking multi-provider LLM chain for {target_name}...")
        response = await asyncio.wait_for(llm.ainvoke(messages), timeout=90.0)
        content = response.content.strip()
    except Exception as e:
        logger.error(f"Primary generation attempt failed for {target_name}: {e}. Retrying with fallback...")
        fallback_llm = get_fallback_llm()
        response = await fallback_llm.ainvoke(messages)
        content = response.content.strip()
    
    # Clean markdown wrapping if present
    if content.startswith("```markdown"):
        content = content[11:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
        
    return {
        "draft_content": content.strip(),
        "iterations": state.get("iterations", 0) + 1,
        "is_approved": True,
        "verification_feedback": ""
    }

async def verify_draft(state: ArtifactState) -> Dict[str, Any]:
    """Single-pass fast approval node to prevent rate-limit loops."""
    return {"is_approved": True, "verification_feedback": ""}

# --- Graph Construction ---
def build_context_engine_graph() -> StateGraph:
    graph_builder = StateGraph(ArtifactState)
    graph_builder.add_node("generate", generate_draft)
    graph_builder.add_node("verify", verify_draft)
    graph_builder.add_edge(START, "generate")
    graph_builder.add_edge("generate", "verify")
    graph_builder.add_edge("verify", END)
    return graph_builder.compile()

context_engine_graph = build_context_engine_graph()
