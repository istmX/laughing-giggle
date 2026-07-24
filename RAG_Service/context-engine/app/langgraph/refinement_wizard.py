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
Your task is to synthesize a user's software idea and Q&A answers into a production-grade Technical Specification Document.

ZENIX DESIGN INTELLIGENCE & CATALOGS:
{matched_knowledge if matched_knowledge else "Extract and synthesize modern design system tokens dynamically based on the project topic."}

CRITICAL DOMAIN & ARCHITECTURAL DIRECTIVES:
1. DOMAIN CLASSIFICATION & FULL-STACK SAAS MANDATE:
   - Carefully determine if the project is a **Full-Stack SaaS / Platform** (requires user data, notes, flashcards, quizzes, AI API calls, or payments) vs a **Visual Portfolio / Showcase**.
   - For **Full-Stack SaaS / Platforms**:
     * **MANDATORY AUTHENTICATION**: Always specify User Authentication (Email/Password + Google OAuth via Supabase Auth, Clerk, Firebase, or NextAuth).
     * **MANDATORY DATABASE**: Always specify Database Schemas & Collections (PostgreSQL/Supabase ORM or MongoDB/Mongoose) for User Accounts, Decks, Flashcards, and Quizzes.
     * **SERVER APIS**: Specify Next.js Route Handlers / Express controllers for AI API proxies (e.g. Google Gemini API).
   - For **Visual Portfolios / Landing Pages**:
     * Strictly BAN backend database or auth models. Specify Next.js + TypeScript + static JSON data schemas (`projects.json`).

2. DYNAMIC DESIGN SYSTEM & DUAL ANIMATION ENGINE:
   - **NO HARDCODED PALETTES OR FONTS**: Dynamically generate an appropriate hex color palette and readable typography scale (Display fonts for headlines; Satoshi/Inter for body prose—NEVER display fonts for body copy!).
   - **DUAL MOTION STANDARD**:
     * **Framer Motion (`framer-motion`)**: Interactive component micro-states, 3D card flips (flashcards), tab pills, and modal overlays.
     * **GSAP + ScrollTrigger**: Page scroll reveals, pinned storytelling hero sections, and timeline sequences.

3. STRUCTURE FOR AI CODING AGENTS:
Your output MUST be a complete Markdown document formatted as follows:

# Technical Specification

## EXECUTIVE SUMMARY & CORE OBJECTIVES
- Vision statement, target audience, core value proposition, and non-negotiable user journeys.

## COMPREHENSIVE FUNCTIONAL REQUIREMENTS
- Explicit user flows, page sections, featured project showcases, and interactive elements.

## ARCHITECTURAL & TECHNOLOGY STACK DECISIONS
- Exact tech stack (Full-Stack Next.js + TS + Auth + DB + Framer Motion + GSAP).
- Feature-based folder tree structure (`src/features/*`).

## DESIGN SYSTEM, TOKENS & MOTION SPECIFICATION
- Exact Hex color palette (Primary, Canvas, Surface, Border, Secondary, Accent).
- Typography scale matrix (Display headlines vs readable Satoshi/Inter body prose).
- Layout tokens (container width, section spacing, corner radii).
- Motion blueprints (Framer Motion component flips + GSAP ScrollTrigger timelines).

## DATA MODEL & DATABASE SCHEMAS
- For Full-Stack SaaS: Complete database models/tables (Users, Decks, Flashcards, Quizzes, GeminiSummaries).
- For Portfolios: Static JSON content schemas (`projects.json`, `skills.json`).

## SECURITY, PERFORMANCE & DEPLOYMENT STRATEGY
- Authentication strategy, image optimization, Vercel/Netlify hosting.

CRITICAL INSTRUCTIONS:
- Do NOT output markdown envelope wrapping (no ```markdown). Start directly with # Technical Specification.
- Absolutely NO placeholders, "TODO" comments, or summarized checklists. Every token and schema must be fully written out.
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Original Idea:\n{idea}\n\nQ&A History:\n{qa_text}")
    ]
    
    response = llm.invoke(messages)
    
    return {"refined_spec": response.content.strip()}


def build_refinement_graph() -> StateGraph:
    graph_builder = StateGraph(RefinementState)
    graph_builder.add_node("refine", refine_spec)
    graph_builder.add_edge(START, "refine")
    graph_builder.add_edge("refine", END)
    return graph_builder.compile()

refinement_graph = build_refinement_graph()
