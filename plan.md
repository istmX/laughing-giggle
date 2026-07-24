# Zenix AI Context Engine & RAG Architecture Plan

This document defines the architecture, workflow, and implementation roadmap for the Zenix AI Context Generation microservice in `RAG_Service/context-engine`.

---

## 1. Core Workflow Architecture (`context.png` & `workflow.md`)

The AI Context Engine transforms raw user ideas into exhaustive, production-ready AI development context through a 5-stage pipeline:

```
[User Idea]
    ↓
[Stage 1: Adaptive Flaw-Finding & Gap-Filling Q&A (Max 10 Questions)]
    ↓
[Stage 2: Master Specification Synthesis + Deep Knowledge RAG Processing]
    ↓
[Stage 3: Parallel Load-Balanced Blueprint Context Generation]
    ↓
[Stage 4: Multi-Pass Verification & Completion Loop (Up to 3 Passes)]
    ↓
[Exhaustive 4-File AI Blueprint: agents.md, design.md, architecture.md, project-overview.md]
```

---

## 2. Pipeline Stage Breakdown

### Stage 1: Adaptive Flaw-Finding & Gap-Filling Q&A
- **Goal**: Analyze the user's initial software prompt, identify missing technical/design requirements or logical flaws, and ask clarifying questions.
- **Rules**:
  - Questions must focus *strictly* on resolving gaps in the user's idea.
  - Adaptive count: As many questions as needed to fill all gaps (up to **10 questions max**).

### Stage 2: Deep Knowledge RAG Processing & Specification Synthesis
- **Goal**: Synthesize user input + Q&A responses + complete RAG knowledge base into a **Master Technical Specification**.
- **Knowledge Ingestion (`app/knowledge/`)**:
  - `knowledge/ui/animations/`: GSAP scroll triggers, stagger delays, motion curves.
  - `knowledge/ui/colors/`: HSL tailored palettes, semantic tokens (`bg-canvas`, `bg-surface-elevated`, `text-ink`, `border-hairline`).
  - `knowledge/ui/typography/`: Satoshi, Bebas Neue, Inter typography scales and font metrics.
  - `knowledge/ui/stacks/` & `knowledge/ui/projects/`: Domain rules (Next.js + GSAP for Web, Expo for Mobile, Node/Postgres for SaaS platforms).
  - `knowledge/ui/ux/`, `knowledge/ui/templates/`, `knowledge/context/`: Component specs and structural reference blueprints.

### Stage 3: Parallel Load-Balanced Blueprint Generation
- **Goal**: Generate the 4 core context blueprint files concurrently in high-fidelity Markdown:
  1. `agents.md`: AI operational guidelines, allowed libraries, build missions, and strict application code standards (e.g. source component files <150 lines).
  2. `design.md`: Complete visual design system (hex palette, typography scale matrix, layout tokens, GSAP motion curves).
  3. `architecture.md`: Feature-based folder tree (`src/features/*`), data flow models, API contracts, routing boundaries.
  4. `project-overview.md`: Product vision, wireframe screen inventory, non-negotiable user journeys.
- **Provider Load Balancer & Fallback Pool (`app/core/llm.py`)**:
  - Round-Robin distribution across API keys (Gemini 2.5/3.5 Pro & Flash, Groq Key I/II, Mistral Key I/II).
  - Parallel generation via `asyncio.gather()`.
  - Automatic sequential failover (Primary → Backup) on 429 rate limits or errors.

### Stage 4: Multi-Pass Verification & Self-Correction Loop
- **Goal**: Evaluate generated blueprint files across up to **3 passes**.
- **Behavior**: Verifies that every file is complete, detailed, adheres to design tokens and code standards, and contains zero `TODO` comments. Triggers a revision pass if any section is missing.

---

## 3. Technology Stack

- **API Layer**: FastAPI + Uvicorn
- **Orchestration**: LangChain + LangGraph
- **Vector Search / RAG**: Qdrant + Local Embeddings / Google GenAI Embeddings
- **Multi-LLM Pool**: Google Gemini (3.5/2.5 Flash & Pro), Groq (`llama-3.1-8b-instant`), Mistral (`mistral-large-latest`)
- **Streaming**: Server-Sent Events (SSE)

---

## 4. API Key Scoping Strategy

- **Primary Keys (`GROQ_API_KEY`, `MISTRAL_API_KEY`, `GEMINI_API_KEY`)**: Used as the primary load-balanced pool for context generation and RAG ingestion.
- **Secondary Keys (`GROQ_API_KEY_II`, `MISTRAL_API_KEY_II`, `GEMINI_API_KEY_II`)**: Reserved primarily for the **AI Playground** dynamic interactive loop, but integrated into the context generation fallback chain as a **worst-case scenario fallback** to ensure context compilation never fails due to rate limits.

