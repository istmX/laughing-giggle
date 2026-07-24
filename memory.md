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

---

## 🔒 Agent Guidelines & Verification Protocol
1. **Never make duplicate sequential API requests** on a single user action.
2. **Always extract string content safely** from LLM responses (`getattr(response, "content", response)`) before calling `.replace()` or `.strip()`.
3. **Always review `memory.md`** before refactoring graph logic or API routes.
