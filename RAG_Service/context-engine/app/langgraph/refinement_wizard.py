from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.llm import get_fallback_llm
import os
from loguru import logger

class RefinementState(TypedDict):
    idea_prompt: str
    questions_and_answers: List[Dict[str, str]]
    refined_spec: str

def refine_spec(state: RefinementState) -> Dict[str, Any]:
    logger.info("Running Refinement Graph: Synthesizing Specification")
    
    llm = get_fallback_llm()
    
    qa_text = "\n".join([f"Q: {qa['question']}\nA: {qa['answer']}" for qa in state['questions_and_answers']])
    
    system_prompt = """You are a Senior Technical Architect at Zenix (created by developer "Istm").
Your task is to take a user's raw software idea and their answers to your clarifying questions, and synthesize them into a highly professional, comprehensive, and production-grade Technical Specification Document.

This document serves as the absolute single source of truth for downstream AI coding agents to implement the application. It must be written in a professional, developer-first, and highly structured tone. No emojis are permitted.

Your output MUST be structured as a detailed Markdown document containing the following sections:

1. EXECUTIVE SUMMARY & CORE OBJECTIVES
   - Brief vision statement, target audience, and primary problem definition.
   - Core value proposition and non-negotiable user journeys.

2. COMPREHENSIVE FUNCTIONAL REQUIREMENTS
   - Exhaustive list of core features, divided by domain (e.g., auth, dashboard, feeds, settings, etc.).
   - Explicit user flows, button-trigger states, and navigation maps.

3. ARCHITECTURAL & TECHNOLOGY STACK DECISIONS
   - Detailed stack recommendations based on the user's answers (e.g. Next.js, React, or React Native frontend; Node/Express backend; MongoDB, Supabase, or PostgreSQL database; Zustand for client state).
   - Real-time/offline layer requirements (e.g., WebSockets, Socket.io, Firebase, or standard API polling).
   - Core folder tree structure conforming to Feature-Based Architecture rules (src/pages, src/features, src/shared).

4. DATA MODEL & SCHEMA SPECIFICATION
   - Complete schema designs (either Mongoose schemas or SQL tables) listing all collections/tables, fields, data types, indexes, and primary/foreign relationships.
   - Define exact keys, types (e.g., ObjectId, String, Boolean), and required fields.

5. API ROUTE & COMMUNICATION CONTRACTS
   - Table of main REST endpoints (path, method, request payload, success response body).
   - WebSocket events (if real-time was selected) with event name, payload format, and listener actions.

6. SECURITY, SCALE & DEPLOYMENT STRATEGY
   - Auth strategy (e.g. Clerk, Firebase, JWT) and routing permissions.
   - Offline-first capabilities, cache policies, and sync strategies.

CRITICAL INSTRUCTIONS:
- Do NOT output any markdown backtick block wrapping (i.e. do not start with ```markdown or end with ```). Start directly with the `# Technical Specification` title.
- Do NOT include any conversational fluff, greetings, notes, introductions, or follow-up questions.
- Every section must be completely filled out with realistic, production-ready specifications. Absolutely NO placeholders, "TODO" comments, or summarized checklists are allowed."""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Original Idea:\n{state['idea_prompt']}\n\nQ&A History:\n{qa_text}")
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
