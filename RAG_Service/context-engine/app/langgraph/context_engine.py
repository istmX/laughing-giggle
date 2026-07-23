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

async def generate_draft(state: ArtifactState) -> Dict[str, Any]:
    """Generates high-fidelity markdown context artifacts through dynamic AI reasoning."""
    logger.info(f"Generating draft for {state['target_file_path']}")
    
    spec = state.get('refined_spec', '')
    llm = get_fallback_llm_ii()
    
    matched_design_knowledge = design_knowledge_engine.search_design_context(spec)
    rag_context = f"{state.get('rag_context', '')}\n\n--- MATCHED DESIGN INTELLIGENCE & TOKENS ---\n{matched_design_knowledge}" if matched_design_knowledge else state.get('rag_context', '')

    system_prompt = f"""You are Zenix, a Staff Software Architect and Principal Design Systems Engineer.
Your mission is to generate the highest-fidelity, complete, and implementation-ready engineering markdown file for: "{state['target_file_path']}".

PROJECT SPECIFICATION & REQUIREMENTS:
--- SPECIFICATION ---
{spec}
---------------------

--- DESIGN INTELLIGENCE & ARCHITECTURE RULES ---
{rag_context}

--- DOMAIN BOUNDARY & ARCHITECTURAL REASONING DIRECTIVES ---
1. DYNAMIC DOMAIN ANALYSIS: Analyze the specification to determine whether this project is a Portfolio / Visual Showcase, a Frontend Web Application, a Mobile App, or a Full-Stack Platform.
2. OVER-ENGINEERING PREVENTION:
   - If the project is a Portfolio, Landing Page, or Visual Showcase: DO NOT invent backend MongoDB schemas, Express server controllers, Socket.io websockets, or Clerk authentication unless explicitly requested by the user. Focus 100% on Next.js + TypeScript, Tailwind CSS, GSAP animations, responsive media grids, and design tokens.
   - If the project is a Mobile App: Use Expo + React Native + TypeScript + NativeWind styling conventions.
   - Only include database models, API contracts, and server authentication if the user's specification explicitly demands a full-stack backend platform.
3. TECH STACK SELECTION: Automatically choose modern, industry-standard tech stacks (Next.js + TypeScript for Web, Expo + React Native for Mobile, GSAP for Motion) unless the user specifies a different framework.

Follow these exact file-specific instructions:

1. IF GENERATING "agents.md" (OR ".cursorrules" / "GEMINI.md"):
   - Define the single source of truth for AI coding agents.
   - Set strict code standards: Component files <150 lines, screens <300 lines, stores <250 lines.
   - List whitelisted packages matching the project's chosen tech stack (Lucide Icons, Framer Motion / GSAP, etc.).
   - Write out chronological build phases with sub-tasks, deliverables, and validation criteria. Do not summarize.

2. IF GENERATING "design.md":
   - Complete visual design system specification.
   - Document hex colors (Primary, Canvas, Surface, Border, Secondary, Accent), typography scale matrix (headings, body, captions), corner radii, container max-widths, and spacing scales.
   - Detail component registry specifications for buttons, inputs, headers, navigation, and cards.
   - Specify GSAP motion rules (scroll triggers, stagger delays, ease functions) for interactive web sites.

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
        HumanMessage(content=f"Please generate {state['target_file_path']}.")
    ]
    
    try:
        logger.info(f"Invoking multi-provider LLM chain for {state['target_file_path']}...")
        response = await asyncio.wait_for(llm.ainvoke(messages), timeout=90.0)
        content = response.content.strip()
    except Exception as e:
        logger.error(f"Primary generation attempt failed for {state['target_file_path']}: {e}. Retrying with fallback...")
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
