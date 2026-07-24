# Zenix AI Context Engine & RAG Architecture Plan

This document defines the architecture, workflow, and implementation roadmap for the Zenix AI Context Microservice (`RAG_Service/context-engine`).

---

## 1. Core Workflow Architecture (`context.png` & `workflow.md`)

The AI Context Engine transforms raw user ideas into exhaustive, production-ready AI development context through a 5-stage pipeline:

```
[User Idea]
    ↓
[Stage 1: Reactive Turn-by-Turn Q&A (Adaptive, Max 10 Questions)]
    ↓
[Stage 2: Master Specification Synthesis + Deep Knowledge RAG & Tavily Live Web Scraping]
    ↓
[Stage 3: Redis Caching + Parallel Load-Balanced Blueprint Context Generation]
    ↓
[Stage 4: Multi-Pass Verification & Self-Correction Loop (Up to 3 Passes)]
    ↓
[Exhaustive 4-File AI Blueprint: agents.md, design.md, architecture.md, project-overview.md]
```

---

## 2. Pipeline Stage Breakdown

### Stage 1: Reactive Turn-by-Turn Q&A
- **Behavior**:
  - The AI evaluates the user's latest response on **every turn** (reading prompt + full conversation history).
  - Dynamically generates the **single next best question** and 3 relevant options (always ending with `"Let Zenix decide"`).
  - **Smart Fast-Forward**: If the user selects `"Let Zenix decide"` 2 times in a row or if the prompt is complete, Zenix immediately finishes the wizard (`is_complete: true`).
- **Domain Rules**:
  - **Portfolio / Visual Site**: Strictly bans database/auth questions. Focuses on aesthetics, featured skills, and showcase layouts.
  - **Full-Stack SaaS / Platform**: Asks about core product workflows, target users, and modern 2026 tech stack choices (Supabase, Postgres, Mongo, Firebase).
  - **Mobile App**: Asks about iOS/Android, mobile screens, and offline features.

### Stage 2: Deep Knowledge RAG + Tavily Live Web Scraping
- **Dynamic UI/UX Intelligence (No Hardcoded Palette Constraints)**:
  - Dynamically extracts color palettes, typography scales, and component specs from `app/knowledge/ui/` (`colors/`, `typography/`, `stacks/`, `ux/`).
  - **Tavily Live Web Scraping (`tavily-python`)**:
    - Scrapes live web sources for trending design systems, Awwwards showcases, GitHub open-source component repos, and free motion libraries (**Aceternity UI, Magic UI, Animata, GSAP**).
    - Fetches the latest 2026 official framework documentation (Next.js 15, React 19, Supabase SSR, Tailwind v4).

### Stage 3: Redis Caching & Parallel Load-Balanced Blueprint Generation
- **Redis Caching Layer**:
  - Caches Qdrant vector retrievals, Tavily web search results, and context blueprint drafts in Redis for **0ms instant response times** and token rate-limit protection.
- **Provider Pool Load Balancer (`app/core/llm.py`)**:
  - Round-robin distribution of file generation (`agents.md`, `design.md`, `architecture.md`, `project-overview.md`) across primary API keys (Gemini 2.5/3.5 Pro & Flash, Groq Key I, Mistral Key I).
  - Secondary keys (`_II`) included as **worst-case scenario fallback** to guarantee generation never fails.
  - **35-Second Per-Task Timeout Guard**: Prevents hanging requests; automatically fails over to backup provider if a task exceeds 35 seconds.

### Stage 4: Multi-Pass Verification & Self-Correction Loop
- **Goal**: Evaluate generated blueprint files across up to **3 passes**.
- **Rule Enforcement**:
  - `agents.md`: Strict ban on robotics, sensors, actuators, or AI textbook theory. Focuses 100% on AI coding instructions, code standards (<150 lines/file), and build phases.
  - `design.md`: Exhaustive design system with full hex palettes, typography scale matrices, layout tokens, and GSAP/Motion animation specifications.
  - `architecture.md`: Feature-based directory tree (`src/features/*`), client component hierarchies, and static JSON data schemas for visual sites (zero backend bloat).

---

## 3. Technology Stack

- **API Layer**: FastAPI + Uvicorn
- **Orchestration**: LangChain + LangGraph
- **Vector Search / RAG**: Qdrant Vector Store + Sentence Transformers / Google GenAI Embeddings
- **Web Intelligence**: Tavily AI Search API (`tavily-python`)
- **Cache Layer**: Redis
- **Multi-LLM Pool**: Google Gemini (3.5/2.5 Flash & Pro), Groq (`llama-3.1-8b-instant`), Mistral (`mistral-large-latest`)

---

## 4. API Key Scoping Strategy

- **Primary Keys (`GROQ_API_KEY`, `MISTRAL_API_KEY`, `GEMINI_API_KEY`, `TAVILY_API_KEY`)**: Used for primary load-balanced RAG, live web scraping, and context generation.
- **Secondary Keys (`GROQ_API_KEY_II`, `MISTRAL_API_KEY_II`, `GEMINI_API_KEY_II`)**: Reserved for AI Playground dynamic interactive loops, but integrated into context engine fallback chain as worst-case protection.


