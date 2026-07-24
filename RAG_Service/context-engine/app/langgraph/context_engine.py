from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_load_balanced_llm
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

# Target file index mapping for Load Balancer distribution
FILE_LOAD_BALANCER_INDEX = {
    "agents.md": 0,
    "design.md": 1,
    "architecture.md": 2,
    "project-overview.md": 3,
}

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
    """Generates high-fidelity markdown context artifacts matching the project category using load-balanced AI providers."""
    target_name = os.path.basename(state['target_file_path'])
    iterations = state.get('iterations', 0) + 1
    logger.info(f"Generating draft for {target_name} (Iteration {iterations})")
    
    spec = state.get('refined_spec', '')
    
    # Load Balancer: Rotate starting provider based on target file name to distribute concurrent calls
    start_index = FILE_LOAD_BALANCER_INDEX.get(target_name.lower(), 0)
    llm = get_load_balanced_llm(start_index)
    
    # Read UI design intelligence files directly from knowledge/ui/
    ui_knowledge = ""
    try:
        color_theory_path = os.path.join(BASE_KNOWLEDGE_DIR, "ui", "colors", "color_theory.md")
        typography_path = os.path.join(BASE_KNOWLEDGE_DIR, "ui", "typography", "sans_serif_fonts.md")
        
        ui_docs = []
        if os.path.exists(color_theory_path):
            with open(color_theory_path, "r", encoding="utf-8") as f:
                ui_docs.append("--- COLOR THEORY CATALOG ---\n" + f.read()[:2000])
        if os.path.exists(typography_path):
            with open(typography_path, "r", encoding="utf-8") as f:
                ui_docs.append("--- TYPOGRAPHY CATALOG ---\n" + f.read()[:2000])
        if ui_docs:
            ui_knowledge = "\n\n".join(ui_docs)
    except Exception as e:
        logger.error(f"Error reading UI catalog: {e}")

    matched_design_knowledge = design_knowledge_engine.search_design_context(spec)
    rag_context = f"{state.get('rag_context', '')}\n\n--- UI KNOWLEDGE & TYPOGRAPHY CATALOGS ---\n{ui_knowledge}\n\n--- MATCHED DESIGN INTELLIGENCE ---\n{matched_design_knowledge}"

    reference_template = get_template_for_target(target_name, spec)

    feedback = state.get("verification_feedback", "")
    feedback_prompt = f"\n\nREVISION FEEDBACK FROM PREVIOUS PASS:\n{feedback}\nPlease fix these issues immediately." if feedback else ""

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
-----------------------------------{feedback_prompt}

--- DOMAIN BOUNDARY & ARCHITECTURAL REASONING DIRECTIVES ---
1. ACCURATE DOMAIN ANALYSIS:
   - Carefully evaluate the project specification:
     * **Full-Stack SaaS / Web Platform**: Applications requiring user accounts, persistent user data, external API calls, dashboard analytics, or payments. MANDATE User Authentication (Email/Password + Google OAuth) and Database Schemas (Supabase/PostgreSQL or MongoDB).
     * **Visual Portfolio / Showcase**: Personal developer sites or landing pages. Strictly BAN backend database or auth models. Specify static JSON content schemas (`projects.json`).
     * **Mobile App**: Expo + React Native + TypeScript + NativeWind styling.


2. DYNAMIC DESIGN SYSTEM & DUAL ANIMATION ENGINE:
   - **ZERO HARDCODED PALETTES OR FONTS**: Dynamically generate hex colors and typography scale matrices matching the specific project domain and topic. Display fonts for headlines; Satoshi/Inter for body copy—NEVER display fonts for body prose!
   - **DUAL MOTION ENGINE**: Use **Framer Motion (`framer-motion`)** for interactive component states, 3D card flips, tab pills, and modal overlays. Use **GSAP + ScrollTrigger** for scroll-linked page reveals & hero timelines.

Follow these exact file-specific instructions:

1. IF GENERATING "agents.md":
   - STRICT BAN: DO NOT write about AI agent theory, robotics, sensors, actuators, perception, sensor arrays, or game AI!
   - MANDATORY MEMORY FILES DIRECTIVE:
     * Instruct the AI coding agent that upon starting work, it MUST create and maintain both `progress.md` (task/feature log & error memory) and `problem.md` (system flaw analysis & architecture fix tracking) in the project root.
   - LIVE TECH STACK DOCS SECTION (TAVILY + REDIS SYNC):
     * `agents.md` MUST include a dedicated section titled **"Tech Stack Documentation & Best Practices (Live Tavily Sync)"** detailing official 2026 framework rules, recommended API patterns, and breaking changes for the chosen tech stack.
   - Set strict code standards: Component files <150 lines, screens <250 lines, stores <200 lines. List whitelisted npm packages matching the project's tech stack.

2. IF GENERATING "design.md":
   - Complete visual design system specification generated dynamically from UI Color & Typography catalogs.
   - Document hex colors (Primary, Canvas, Surface, Border, Secondary, Accent), typography scale matrix (Display headlines vs Satoshi/Inter body prose), corner radii, container max-widths, and spacing scales.
   - Detail Motion rules for both Framer Motion (components/flips) and GSAP (scroll timelines).

3. IF GENERATING "architecture.md":
   - Complete feature-based folder tree structure (`src/features/*`).
   - Client component hierarchy, layout boundaries, and responsive breakpoints.
   - For Full-Stack SaaS: Complete Database Schemas (tables/collections, fields, types, indexes) & Auth Strategy.
   - For Portfolios: Static JSON content schemas (`projects.json`, `skills.json`).

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
        response = await asyncio.wait_for(llm.ainvoke(messages), timeout=35.0)
        raw = getattr(response, "content", response)
        if isinstance(raw, list):
            raw = "\n".join([str(item.get("text", item) if isinstance(item, dict) else item) for item in raw])
        content = str(raw).strip()
    except Exception as e:
        logger.error(f"Primary generation attempt failed for {target_name}: {e}. Retrying with backup provider...")
        backup_llm = get_load_balanced_llm(start_index + 1)
        response = await backup_llm.ainvoke(messages)
        raw = getattr(response, "content", response)
        if isinstance(raw, list):
            raw = "\n".join([str(item.get("text", item) if isinstance(item, dict) else item) for item in raw])
        content = str(raw).strip()

    
    # Clean markdown wrapping if present
    if content.startswith("```markdown"):
        content = content[11:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
        
    return {
        "draft_content": content.strip(),
        "iterations": iterations,
        "is_approved": True,
        "verification_feedback": ""
    }


async def verify_draft(state: ArtifactState) -> Dict[str, Any]:
    """Verification pass checking completeness and quality of the draft."""
    content = state.get("draft_content", "")
    iterations = state.get("iterations", 1)
    
    # Fast path: Approve if content is comprehensive (>1200 chars) or max iterations (3) reached
    if len(content) > 1200 or iterations >= 3:
        return {"is_approved": True, "verification_feedback": ""}
        
    # Request improvement if draft is too short
    return {
        "is_approved": False,
        "verification_feedback": "The generated document is too short or incomplete. Expand all sections with exhaustive detail, design tokens, and technical standards."
    }

def route_verification(state: ArtifactState) -> str:
    if state.get("is_approved", True) or state.get("iterations", 1) >= 3:
        return END
    return "generate"

# --- Graph Construction ---
def build_context_engine_graph() -> StateGraph:
    graph_builder = StateGraph(ArtifactState)
    graph_builder.add_node("generate", generate_draft)
    graph_builder.add_node("verify", verify_draft)
    graph_builder.add_edge(START, "generate")
    graph_builder.add_edge("generate", "verify")
    graph_builder.add_conditional_edges("verify", route_verification, {END: END, "generate": "generate"})
    return graph_builder.compile()

context_engine_graph = build_context_engine_graph()

