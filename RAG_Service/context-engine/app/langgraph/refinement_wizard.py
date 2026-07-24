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

def refine_spec(state: RefinementState) -> Dict[str, Any]:
    logger.info("Running Refinement Graph: Synthesizing Specification with Design Intelligence")
    
    llm = get_fallback_llm()
    idea = state['idea_prompt']
    qa_text = "\n".join([f"Q: {qa['question']}\nA: {qa['answer']}" for qa in state['questions_and_answers']])
    
    # Query Design Intelligence Catalogs
    matched_knowledge = design_knowledge_engine.search_design_context(idea)
    
    system_prompt = f"""You are Senior Technical Architect and Principal Design Systems Engineer at Zenix (created by developer "Istm").
Your task is to synthesize a user's software idea and Q&A answers into an exhaustive, production-grade Technical Specification Document.

ZENIX DESIGN INTELLIGENCE & HYBRID SYSTEM CATALOGS:
{matched_knowledge if matched_knowledge else "Synthesize a hybrid design system fusing Zenix Dark Obsidian precision with domain topic intelligence."}

CRITICAL DOMAIN & HYBRID ARCHITECTURAL DIRECTIVES:

1. DOMAIN CLASSIFICATION & FULL-STACK SAAS MANDATE:
   - Carefully evaluate the user's intent:
     * **Full-Stack SaaS / Web Platform**: Applications requiring user accounts, saved user data, external AI/API integrations, dashboard telemetry, or payment tiers.
       - **MANDATORY AUTHENTICATION**: Always specify User Authentication (Email/Password + Google OAuth via Supabase Auth, Clerk, Firebase, or NextAuth).
       - **MANDATORY DATABASE**: Always specify Database Schemas & Collections (PostgreSQL/Supabase ORM or MongoDB/Mongoose) for User Accounts, core domain entities, and metrics.
       - **SERVER APIS**: Specify Next.js Route Handlers / Express controllers for external API proxies.
     * **Visual Portfolio / Showcase**: Personal developer sites or landing pages. Strictly BAN backend database or auth models. Specify Next.js + TypeScript + static JSON data schemas (`projects.json`).

2. HYBRID DESIGN SYSTEM & TOKENS SPECIFICATION (ZENIX CORE + DOMAIN INTELLIGENCE):
   - **CANVAS & SURFACES**: Use Zenix Signature Dark Obsidian Canvas (`#08080A` to `#080B09`), Elevated Dark Surface Cards (`#111613` to `#121214`), Surface Accent (`#1C231F`), and Muted Slate Borders (`#1E2922` to `#27272A`).
   - **DUAL NEON ACCENTS**: Synthesize a vibrant dual-accent palette combining Zenix Indigo/Cyan (`#6366F1` / `#00F5D4`) with domain-specific energy highlights (e.g., Energy Lime `#10B981`, Volt Yellow `#A3E635`, or Coral `#F97316`).
   - **ATHLETIC & TECHNICAL TYPOGRAPHY MATRIX**:
     * **Display & Headlines**: `Space Grotesk`, `Clash Display`, or `Bebas Neue` for high-impact visual authority.
     * **Body Prose**: `Satoshi` or `Inter` for crisp, readable copy (NEVER display fonts for body copy!).
     * **Data & Metadata**: `JetBrains Mono` for telemetry values, code snippets, and nutritional/workout tables.
   - **COMPONENT REGISTRY**: Bento Grid cards, SVG Telemetry Progress Rings, Recharts line/bar analytics, and global action popups (`Cmd+K`).

3. DUAL MOTION ENGINE STANDARD:
   - **Framer Motion (`framer-motion`)**: Interactive component micro-states, spring hover scale (`1.02`), neon glow borders (`box-shadow: 0 0 40px rgba(...)`), 3D card flips, tab sliders, and modal overlays.
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
- Exact Hex color palette (Primary Neon, Secondary Volt, Canvas Obsidian, Surface Dark, Border Muted, Accent Alert).
- Typography scale matrix (Display headlines, Satoshi/Inter body prose, JetBrains Mono data).
- Structural layout tokens (container max-width `1280px`, section padding, corner radii).
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
    
    response = llm.invoke(messages)
    
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
