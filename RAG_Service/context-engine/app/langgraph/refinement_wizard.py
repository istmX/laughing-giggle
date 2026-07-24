from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
import os
from loguru import logger
from app.core.design_knowledge import design_knowledge_engine

class RefinementState(TypedDict):
    idea_prompt: str
    questions_and_answers: List[Dict[str, str]]
    refined_spec: str

async def refine_spec(state: RefinementState) -> Dict[str, Any]:
    """Node that synthesizes the refined technical specification."""
    logger.info("Running Refinement Graph: Synthesizing Specification with Design Intelligence")
    
    llm = get_fallback_llm()
    idea = state.get("idea_prompt", "")
    qa_text = "\n".join([f"Q: {qa['question']}\nA: {qa['answer']}" for qa in state['questions_and_answers']])
    
    # Query Design Intelligence Catalogs
    matched_knowledge = design_knowledge_engine.search_design_context(idea)
    
    system_prompt = f"""You are Senior Technical Architect and Principal Design Systems Engineer at Zenix (created by developer "Istm").
Your task is to synthesize a user's software idea and Q&A answers into an exhaustive, production-grade Technical Specification Document.

ZENIX KNOWLEDGE & UI CATALOG ENGINE CONTEXT (`RAG_Service/context-engine/app/knowledge/ui`):
{matched_knowledge if matched_knowledge else "Query and dynamically compose design tokens, typography scales, color palettes, motion rules, and UX guidelines based on the user's project domain."}

CRITICAL DOMAIN & DYNAMIC SYNTHESIS DIRECTIVES:

1. DOMAIN CLASSIFICATION & FULL-STACK SAAS MANDATE:
   - Carefully evaluate the user's intent:
     * **Full-Stack SaaS / Web Platform**: Applications requiring user accounts, saved user data, external AI/API integrations, dashboard telemetry, or payment tiers.
       - **MANDATORY AUTHENTICATION**: Always specify User Authentication (Email/Password + Google OAuth via Supabase Auth, Clerk, Firebase, or NextAuth).
       - **MANDATORY DATABASE**: Always specify Database Schemas & Collections (PostgreSQL/Supabase ORM or MongoDB/Mongoose) for User Accounts, core domain entities, and metrics.
       - **SERVER APIS**: Specify Next.js Route Handlers / Express controllers for external API proxies.
     * **Visual Portfolio / Showcase**: Personal developer sites or landing pages. Strictly BAN backend database or auth models. Specify Next.js + TypeScript + static JSON data schemas (`projects.json`).

2. DYNAMIC DESIGN SYSTEM & TOKENS SYNTHESIS (NO HARDCODED VALUES):
   - **ZERO HARDCODED PALETTES OR FONTS**: Dynamically compose color tokens (Canvas, Surface, Primary Accent, Secondary Accent, Border, Text Muted) and typography scales by combining Zenix core design principles with domain-matched patterns retrieved from `RAG_Service/context-engine/app/knowledge/ui`.
   - **TYPOGRAPHY RULES**: Always use display/heading fonts for headers and clean body fonts (Satoshi/Inter) for body prose. NEVER use display fonts for long copy blocks. Use Monospace fonts for data tables, metrics, and logs.

3. DUAL MOTION ENGINE STANDARD:
   - **Framer Motion (`framer-motion`)**: Interactive component micro-states, hover glows, 3D card flips, tab sliders, and modal overlays.
   - **GSAP + ScrollTrigger**: Page scroll reveals, pinned storytelling hero timelines, and multi-card staggered reveals.

4. STRUCTURE FOR AI CODING AGENTS:
Your output MUST be a complete, highly detailed Markdown document formatted as follows:

# Technical Specification

## EXECUTIVE SUMMARY & CORE OBJECTIVES
- Vision statement, target audience matrix (pain points vs solutions), core value proposition, and non-negotiable user journeys.

## COMPREHENSIVE FUNCTIONAL REQUIREMENTS
- Explicit user flows, page sections, featured project showcases, interactive telemetry elements, and payment tier specs.

## ARCHITECTURAL & TECHNOLOGY STACK DECISIONS
- Exact tech stack (Full-Stack Next.js 14+ App Router + TS + Supabase/Prisma + Auth + DB + Recharts + Framer Motion + GSAP).
- Feature-based folder tree structure (`src/features/*`).

## DESIGN SYSTEM, TOKENS & DUAL MOTION SPECIFICATION
- Exact Hex color palette synthesized from UI Knowledge Catalogs (Primary, Secondary, Canvas, Surface, Border, Text).
- Typography scale matrix (Display headlines, Satoshi/Inter body prose, Monospace data).
- Structural layout tokens (container max-width, section padding, corner radii).
- Dual Motion blueprints (Framer Motion component variants + GSAP ScrollTrigger timeline code blocks).

## DATA MODEL & DATABASE SCHEMAS
- For Full-Stack SaaS: Complete Prisma ORM / PostgreSQL schemas (User, UserProfile, DomainLogs, Subscriptions, Enums).
- For Portfolios: Static JSON content schemas (`projects.json`, `skills.json`).

## SECURITY, PERFORMANCE & DEPLOYMENT STRATEGY
- Edge middleware token verification, Stripe webhook cryptographic signatures, rate limiting, and Vercel hosting.

CRITICAL INSTRUCTIONS:
- Do NOT output markdown envelope wrapping (no ```markdown). Start directly with # Technical Specification.
- Absolutely NO placeholders, "TODO" comments, or summarized checklists. Every single token, schema, and animation code block must be fully written out.
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Original Idea:\n{idea}\n\nQ&A History:\n{qa_text}")
    ]
    
    try:
        response = await asyncio.wait_for(llm.ainvoke(messages), timeout=25.0)
    except Exception as e:
        logger.warning(f"Primary refinement LLM timed out or failed ({e}). Retrying with backup provider...")
        backup_llm = get_load_balanced_llm(1)
        response = await asyncio.wait_for(backup_llm.ainvoke(messages), timeout=20.0)
    
    raw_content = getattr(response, "content", response)
    if isinstance(raw_content, list):
        raw_content = "\n".join([str(item.get("text", item) if isinstance(item, dict) else item) for item in raw_content])
    
    return {"refined_spec": str(raw_content).strip()}

def build_refinement_graph() -> StateGraph:
    graph_builder = StateGraph(RefinementState)
    graph_builder.add_node("refine", refine_spec)
    graph_builder.add_edge(START, "refine")
    graph_builder.add_edge("refine", END)
    return graph_builder.compile()

refinement_graph = build_refinement_graph()
