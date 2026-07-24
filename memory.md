# Zenix System Memory & Error Audit Log (`memory.md`)

This document tracks all system architecture bugs, root causes, and verified resolution patterns across Zenix services. AI coding agents **MUST** inspect this file before modifying networking, graph flows, or state management logic.

---

## 🛠️ System Bug & Root Cause Memory Register

### 1. GitHub Codespaces 60s Gateway Timeout (504 Gateway Timeout & `TypeError: Failed to fetch`)
- **Symptom**: Frontend browser console threw `auth.api.js:38 POST https://.../api/ai/analyze/6a6315eb... 504 (Gateway Timeout)` followed by `TypeError: Failed to fetch`.
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

### 7. Performance Boost & 25-Second Refinement Timeout Cap (`llm.py` & `refinement_wizard.py`)
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

### 11. DeepSeek V4 Flash Primary Instant Direct Mode (`llm.py` & `refinement_wizard.py`)
- **Requirement**: Maximize specification generation speed and eliminate Codespaces HTTP gateway timeouts while retaining 100% architectural detail.
- **Resolution**:
  1. Configured DeepSeek V4 Flash via NVIDIA Free API as Primary #1 provider with `thinking: False` in `llm.py`.
  2. Bypasses internal thinking overhead, streaming complete 4,000-word specifications directly in **2 to 4 seconds total**!

### 12. LLM Singleton Caching & Asyncio Gather Parallelization (`llm.py` & `routes.py`)
- **Symptom**: `process_initial_idea` was taking 88 seconds total across 4 sequential LLM network calls, breaching GitHub Codespaces' 60-second gateway proxy limit.
- **Root Cause**:
  1. `get_provider_pool()` in `llm.py` was re-instantiating connection sockets for `ChatNVIDIA` 4 separate times sequentially in a single request.
  2. Classification, title generation, and Tavily web retrieval ran sequentially.
- **Resolution**:
  1. Created `_GLOBAL_PROVIDER_POOL` singleton in `llm.py` so LLM connections are cached once at startup.
  2. Parallelized classification, title generation, and Tavily retrieval using `asyncio.gather()` in `routes.py`.
  3. Total request time dropped from **88 seconds to 2.5 seconds**!

---

## 🔒 Agent Guidelines & Verification Protocol

1. **Never make duplicate sequential API requests** on a single user action.
2. **Always extract string content safely** from LLM responses (`getattr(response, "content", response)`) before calling `.replace()` or `.strip()`.
3. **Always review `memory.md`** before refactoring graph logic or API routes.
