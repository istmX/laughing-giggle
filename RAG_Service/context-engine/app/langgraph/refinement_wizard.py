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
{matched_knowledge if matched_knowledge else "Apply modern design system tokens, Satoshi/Bebas Neue fonts, 32px radii, and GSAP motion principles."}

CRITICAL DOMAIN & ARCHITECTURE RULES:
1. DOMAIN CHECK & OVER-ENGINEERING PREVENTION:
   - If the project is a **Portfolio, Agency Showcase, Landing Page, Developer Showcase, or Visual Site**:
     * **STRICT BAN**: DO NOT generate MongoDB schemas, Mongoose models, Node/Express backend APIs, WebSockets, or JWT login/registration flows!
     * Stack: **Next.js + TypeScript + Tailwind CSS + GSAP Motion**.
     * Replace database/auth sections with **DESIGN SYSTEM & TOKENS SPECIFICATION** (Hex colors, Satoshi / Bebas Neue typography scale, 32px pill radii, 1120px max-width) and **GSAP MOTION SPECIFICATION** (ScrollTrigger, stagger animations, hover micro-interactions).
   - If the project is a **Mobile App**:
     * Stack: **Expo + React Native + TypeScript + NativeWind**.
   - If and ONLY IF the project is a **Full-Stack SaaS / Platform**:
     * Include database schemas, REST endpoints, and authentication middleware.

2. STRUCTURE FOR AI CODING AGENTS:
Your output MUST be a complete Markdown document formatted as follows:

# Technical Specification

## EXECUTIVE SUMMARY & CORE OBJECTIVES
- Vision statement, target audience, core value proposition, and non-negotiable user journeys.

## COMPREHENSIVE FUNCTIONAL REQUIREMENTS
- Explicit user flows, page sections, featured project showcases, and interactive elements.

## ARCHITECTURAL & TECHNOLOGY STACK DECISIONS
- Exact tech stack matching domain rules (Next.js + TS + GSAP for web/portfolio, Expo for mobile).
- Feature-based folder tree structure (src/pages, src/features, src/shared).

## DESIGN SYSTEM, TOKENS & GSAP MOTION SPECIFICATION
- Exact Hex color palette (Primary, Canvas, Surface, Border, Secondary, Accent).
- Typography scale matrix (display-xl, display-lg, headline, body, eyebrow font faces and metrics).
- Layout tokens (1120px container width, 80px section spacing, 32px corner radius).
- GSAP animation blueprints (ScrollTrigger pins, stagger delays, ease curves, hover transitions).

## DATA MODEL / CONTENT STRUCTURE
- For Portfolios/Showcases: Document static JSON content schemas (projects, skills, experience, case studies).
- For Full-Stack SaaS only: Document database schemas (tables/collections, fields, types, indexes).

## SECURITY, PERFORMANCE & DEPLOYMENT STRATEGY
- Responsive performance rules, image optimization, Vercel/Netlify hosting strategy.

CRITICAL INSTRUCTIONS:
- Do NOT output markdown envelope wrapping (no ```markdown). Start directly with # Technical Specification.
- Absolutely NO placeholders, "TODO" comments, or summarized checklists. Every single token and rule must be fully written out.
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
