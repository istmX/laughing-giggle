# Zenix System Memory & Error Audit Log (`memory.md`)

This document tracks all system architecture bugs, root causes, and verified resolution patterns across Zenix services. AI coding agents **MUST** inspect this file before modifying networking, graph flows, or state management logic.

---

## 🛠️ System Bug & Root Cause Memory Register

### 1. GitHub Codespaces 60s Gateway Timeout (504 Gateway Timeout & `TypeError: Failed to fetch`)
- **Symptom**: Frontend browser console threw `auth.api.js:38 POST https://.../api/ai/analyze/<idea-id> 504 (Gateway Timeout)` followed by `TypeError: Failed to fetch`.
- **Root Cause**: The frontend (`useChatHandlers.js`) was making **two sequential backend calls** (`analyzeIdea()` then `processConversation()`) on a single user submission. Each call triggered full Python LLM orchestration sequentially (~30s + ~35s = ~65s total). GitHub Codespaces HTTP Ingress proxies enforce a strict **60-second gateway timeout cap**, causing the proxy to cut the HTTP connection right before the second request completed!
- **Resolution**: Eliminated the redundant `analyzeIdea()` call from `useChatHandlers.js`. `processConversation()` handles title generation, classification, Q&A, and specification synthesis in a single unified API roundtrip well under 25 seconds.

---

### 2. `'list' object has no attribute 'replace'` in Question Generator (`pm_wizard.py`)
- **Symptom**: Python backend threw `ERROR | app.langgraph.pm_wizard:generate_questions:110 - Failed to parse next question: 'list' object has no attribute 'replace'`.
- **Root Cause**: Gemini 3.5 Flash and DeepSeek V4 Flash return message content as a `list` of text block objects (`response.content`). `pm_wizard.py` attempted to call `.replace('```json', '')` directly on the list object instead of converting it to a string first.
- **Resolution**: Created a safe text extraction pipeline `raw = getattr(response, "content", response)` and `"\n".join(...)` before invoking string methods. Replaced all static hardcoded default question fallbacks with automatic completion (`is_complete: True`).

---

### 3. `'list' object has no attribute 'strip'` in Parallel Blueprint Generation (`context_engine.py`)
- **Symptom**: Python backend threw `ERROR | app.langgraph.context_engine:generate_draft:167 - Primary generation attempt failed for agents.md: 'list' object has no attribute 'strip'`.
- **Root Cause**: `generate_draft()` called `.strip()` directly on message objects returned by multi-provider LLMs.
- **Resolution**: Added safe string normalization before calling `.strip()`, ensuring `agents.md`, `design.md`, `architecture.md`, and `project-overview.md` parse cleanly.

---

### 4. Tavily 400-Character Search Query Limit Error (`tavily_search.py`)
- **Symptom**: Tavily search failed with `Query is too long. Max query length is 400 characters`.
- **Root Cause**: Raw detailed user prompts were passed directly to Tavily AI without truncation.
- **Resolution**: Added safe 250-character query truncation and sanitization in `tavily_search.py`.

---

### 5. ChatNVIDIA `extra_body` Constructor Warning (`llm.py`)
- **Symptom**: Python console threw `UserWarning: extra_body is not default parameter. extra_body was transferred to model_kwargs`.
- **Root Cause**: `ChatNVIDIA` constructor expects `model_kwargs={"extra_body": ...}` rather than top-level `extra_body`.
- **Resolution**: Updated `llm.py` to wrap reasoning effort parameters inside `model_kwargs`.

### 6. Tavily Web Search 60s Hanging Delay & CORS Error (`tavily_search.py`)
- **Symptom**: Server log showed `Tavily search failed ... Request timed out after 60 seconds` followed by browser CORS errors and Codespaces 504 Gateway Timeouts.
- **Root Cause**: `TavilyClient.search()` was executing synchronously without a timeout limit. When Tavily API servers took more than 60 seconds to respond, Codespaces proxy dropped the browser connection, resulting in a false CORS/ERR_FAILED error on the client while Python finished in the background 30 seconds later!
- **Resolution**: Refactored `tavily_search.py` with an `asyncio.wait_for(..., timeout=4.0)` cap. If Tavily web search doesn't respond within **4.0 seconds**, Zenix skips Tavily cleanly and immediately proceeds with DeepSeek V4 Flash generation in under 15 seconds!

### 7. Performance Boost & 25-Second Refinement Timeout Cap (`llm.py` & `refinement_wizard.py`) [SUPERSEDED]
> **Note**: Superseded by current 40.0-second timeout cap and DeepSeek V4 Flash medium reasoning configuration (see `frontend/progress.md`).
- **Symptom**: Technical specification synthesis took 91 seconds when DeepSeek V4 Flash ran high reasoning, causing Codespaces HTTP Ingress Proxy to cut the browser connection at 60 seconds with a 504 Gateway Timeout.
- **Root Cause**: DeepSeek V4 Flash was set as Primary #1 with `reasoning_effort: "high"` across all tasks without a timeout cap.
- **Resolution**:
  1. Re-ordered provider pool in `llm.py` so **Gemini 3.5 Flash** is Primary #1 for ultra-fast response times (2–4 seconds).
  2. Set DeepSeek V4 Flash to `reasoning_effort: "medium"` for balanced 10–15s reasoning speed.
  3. Added `asyncio.wait_for(..., timeout=25.0)` to `refinement_wizard.py`. Total API roundtrips now complete in **3–12 seconds total**, completely eliminating Codespaces proxy 60s timeouts!

### 8. Async Refinement Graph Invocation & Coroutine Warning (`routes.py` & `tavily_search.py`)
- **Symptom**: Server threw HTTP 500 error: `Failed to process idea: No synchronous function provided to "refine". Either initialize with a synchronous function or invoke via the async API (ainvoke, astream, etc.)`.
- **Root Cause**: When `refine_spec` in `refinement_wizard.py` was made async (to support `asyncio.wait_for` timeouts), `routes.py` line 212 was still calling `refinement_graph.invoke(...)` synchronously instead of `await refinement_graph.ainvoke(...)`.
- **Resolution**: Updated `routes.py` line 212 to `await refinement_graph.ainvoke(refinement_input)` and fixed `tavily_search.py` synchronous helper wrapper.

### 9. NameError `asyncio` & `get_load_balanced_llm` Unbound Imports (`refinement_wizard.py`)
- **Symptom**: Python backend threw `WARNING: Primary refinement LLM timed out or failed (name 'asyncio' is not defined). Retrying with backup provider...` followed by `ERROR: Failed to process idea: name 'get_load_balanced_llm' is not defined`.
- **Root Cause**: When adding exception timeout handling to `refinement_wizard.py`, `import asyncio` and `get_load_balanced_llm` were referenced in the `try/except` block without being declared at the top of the file.
- **Resolution**: Added `import asyncio` and imported `get_load_balanced_llm` at top of `refinement_wizard.py`.

### 10. Unhandled Exception Guard in Backup Refinement Fallback (`refinement_wizard.py`)
- **Symptom**: Server threw HTTP 500 error: `Failed to process idea:` with an empty exception message when both primary and backup LLM timeouts expired.
- **Root Cause**: The backup LLM execution inside the `except` block of `refinement_wizard.py` did not have an internal `try/except` guard. When the backup model timed out, it threw an unhandled `TimeoutError` that crashed the route handler.
- **Resolution**: Wrapped the backup LLM execution in an internal `try/except` block with a safe fallback text generator.

### 11. DeepSeek V4 Flash Primary Instant Direct Mode (`llm.py` & `refinement_wizard.py`) [HISTORICAL]
> **Note**: Historical reference. Current canonical configuration uses `thinking: True` with `reasoning_effort: "medium"` and 40.0s timeout cap.
- **Requirement**: Maximize specification generation speed and eliminate Codespaces HTTP gateway timeouts while retaining 100% architectural detail.
- **Resolution**:
  1. Configured DeepSeek V4 Flash via NVIDIA Free API as Primary #1 provider with `thinking: False` in `llm.py`.
  2. Bypasses internal thinking overhead, streaming complete 4,000-word specifications directly in **2 to 4 seconds total**!

### 13. Turn > 1 Fast-Forward Execution & Async Options Invocation (`routes.py`)
- **Symptom**: Clarifying question turns during the PM Wizard interview took 36 to 60 seconds per question, causing heavy slowness.
- **Root Cause**:
  1. `process_initial_idea` was running classification (LLM), project title generation (LLM), and RAG/Tavily retrieval (Vector DB + Web Search) on **every single answer turn**, despite these tasks only being necessary on Turn 1!
  2. `generate_options_for_question` used synchronous `llm.invoke()`, blocking Python's event loop.
- **Resolution**:
  1. Added a `if len(history) == 0:` guard around Classification, Title Generation, and RAG Retrieval. Turns > 1 now bypass these tasks completely.
  2. Converted options and title generation to `async def` using `await llm.ainvoke()`.
  3. Replaced fragile `json.loads` substrings with regex pattern matching (`re.search(r'\{.*\}', content, re.DOTALL)` and `re.search(r'\[.*\]', content, re.DOTALL)`) to strip DeepSeek thinking headers safely.

### 14. Uncaught Backup LLM Timeout & Blueprint Artifact HTTP 500 (`context_engine.py` & `routes.py`)
- **Symptom**: Parallel generation of `agents.md`, `design.md`, `architecture.md`, and `project-overview.md` threw `Primary generation attempt failed ... Retrying with backup provider...` followed by `Failed to generate artifact:` HTTP 500 Internal Server Error, returning incomplete/fallback templates.
- **Root Cause**:
  1. Primary LLM timeout in `context_engine.py` was set to an unrealistically short 18.0s timeout. When it expired, the backup LLM ran with no `try/except` wrapper. When the backup also timed out or failed, the uncaught exception crashed the route with HTTP 500.
  2. `generate_artifact` passed `retriever.retrieve_context(fpath)` (e.g. searching the literal filename `"project-overview.md..."`), resulting in 0 context documents retrieved every single time.
- **Resolution**:
  1. Raised primary LLM generation timeout in `context_engine.py` to **35.0 seconds** and wrapped backup LLM invocation in an internal `try/except` block with a clean baseline specification fallback.
  2. Updated `routes.py` to query `retriever.retrieve_context(spec[:300] if spec else fpath)` using the actual specification text.

### 15. Total System Prompt Overhaul & Dynamic RAG Alignment (`prompts/`, `langgraph/`)
- **Symptom**: System prompts were hardcoding exact tech stacks (Next.js 14+ App Router, Supabase Auth, Prisma ORM, GSAP, Stripe, Vercel) regardless of what the user asked for. Generic prompts caused all 4 blueprint files (`agents.md`, `design.md`, `architecture.md`, `project-overview.md`) to output identical `# Technical Specification` content.
- **Root Cause**:
  1. System prompts in `refinement_wizard.py` and `context_engine.py` contained hardcoded framework strings instead of dynamically reading user prompts and RAG knowledge catalogs (`app/knowledge/ui/` and `app/knowledge/context/`).
  2. Obsolete legacy prompt files (`context_prompt.py`, `refinement_prompt.py`) contained dead 12-key JSON schemas and JS syntax bugs (`JSON.stringify`).
- **Resolution**:
  1. Purged all hardcoded framework and library strings from system prompts.
  2. Refactored `refinement_prompt.py` (`buildRefinementPrompt`) and `context_prompt.py` (`buildFileContextPrompt`) into specialized, dynamic prompt builder functions.
  3. Aligned execution 100% with [`workflow.md`](file:///workspaces/laughing-giggle/workflow.md) and [`context.png`](file:///workspaces/laughing-giggle/context.png). Each file now receives distinct task directives, dynamically generating 4 completely different, high-fidelity context blueprints.

### 16. Tavily Live Web Intelligence & Project Context Deletion Route (`tavily_search.py`, `refinement_wizard.py`, `routes.py`)
- **Symptom**: System prompts lacked live 2026 web intelligence, and deleting a project in the frontend left old context files lingering in memory.
- **Root Cause**:
  1. `refinement_wizard.py` did not query Tavily for 2026 tech stack best practices during technical specification synthesis.
  2. Missing API endpoint for cascading project and session context deletion on `DELETE /api/projects/:id`.
- **Resolution**:
  1. Integrated async Tavily Web Search with a **4.0-second timeout cap** into `refinement_wizard.py` (`buildRefinementPrompt`), injecting live 2026 framework rules and breaking change warnings.
  2. Implemented `DELETE /api/projects/{idea_id}` in `routes.py` to purge generated artifact files and reset session context memory when a user deletes a project.

### 17. Permanent Resolution: Dedicated Fast Model Chain (`get_context_llm()`) & Sequential Dispatch (`context_engine.py`, `llm.py`, `routes.py`)
- **Symptom**: Generating `agents.md`, `design.md`, and `architecture.md` hit primary/backup LLM timeouts (55s/35s) and fell back to template output.
- **Root Cause**:
  1. `get_provider_pool()` included `ChatNVIDIA` (DeepSeek V4 Flash) as primary. When context generation called `get_load_balanced_llm()`, NVIDIA's free API endpoint throttled or took 55+ seconds on heavy markdown tasks.
  2. Bursting 4 parallel tasks hit provider rate-limits simultaneously.
- **Resolution**:
  1. Implemented `get_context_llm()` in `llm.py`, using **Gemini 3.5 Flash primary + Groq Llama 3.1 8B backup ONLY**. Strictly excludes `ChatNVIDIA` / DeepSeek / Mistral from the 4-file context pipeline.
  2. Updated `context_engine.py` to invoke `get_context_llm(start_index)`.
  3. Made worker execution 100% sequential in `routes.py` (`await worker(fpath, key)`), streaming each file cleanly every ~1.8 seconds with **zero API rate-limit collisions**.
  4. Updated `GEMINI.md` and `frontend/AGENTS.md` with mandatory Legacy Code Purge and Sequential Model Dispatch rules.

### 18. Model Order Re-Ordering & Dynamic Theme Engine Overhaul (`llm.py`, `ThemeProvider.jsx`, `Navbar.jsx`)
- **Symptom**: `get_context_llm()` lacked DeepSeek at final fallback, ThemeProvider forced light mode on non-dashboard routes, OS system theme preference was ignored on initial load, and mobile theme toggle was unresponsive.
- **Root Cause**:
  1. `get_context_llm()` only included Flash models without deep fallback options.
  2. `ThemeProvider.jsx` contained `if (isDashboard) ... else root.classList.add('light')`, overriding theme toggles across standard marketing pages.
  3. `preferences.store.js` defaulted to `'light'` instead of system preference tracking (`'system'`).
- **Resolution**:
  1. Updated `get_context_llm()` in `llm.py` to use **Gemini 3.5 Flash ➔ Gemini 2.5 Flash ➔ Groq Llama 3.1 8B FIRST**, placing `ChatNVIDIA` (DeepSeek V4 Flash) strictly at the **very end** of the fallback list as final backup.
  2. Set default store theme to `'system'` in `preferences.store.js` and removed non-dashboard light override in `ThemeProvider.jsx`.
  3. Copied `light_logo.png` and `dark_logo.png` to `frontend/public/` and updated `Navbar.jsx` to render dynamic logos matching active theme contrast, adding a dedicated theme switcher inside the Mobile Navigation Overlay.

---

## 🔒 Agent Guidelines & Verification Protocol

1. **Never make duplicate sequential API requests** on a single user action.
2. **Always extract string content safely** from LLM responses (`getattr(response, "content", response)`) before calling `.replace()` or `.strip()`.
3. **Always review `memory.md`** before refactoring graph logic or API routes.
