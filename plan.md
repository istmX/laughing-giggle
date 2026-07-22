# Zenix RAG Service & AI Orchestration Migration Plan

This document outlines the architecture and implementation roadmap for migrating the Zenix AI orchestration layer from the legacy Node.js backend (`backend/src/features/ai`) into the new Python-based RAG (Retrieval-Augmented Generation) microservice.

---

## 1. The Goal
Move the complete AI feature set into a dedicated Python microservice (`RAG_Service/context-engine`) powered by FastAPI, LangGraph, and Qdrant. This ensures high-performance vector search, intelligent context chunking, and modular graph execution for generation.

The **immediate focus** is routing the very first user input (the "Idea" prompt) into the RAG system to be chunked, embedded, and enriched with internal knowledge base documents before generation.

---

## 2. Architecture of the RAG Microservice

### Tech Stack
- **API Framework**: FastAPI + Uvicorn
- **Orchestration**: LangChain + LangGraph
- **Vector Store**: Qdrant (local/cloud)
- **Embeddings**: Sentence Transformers (local fallback) / Google GenAI Embeddings
- **Parsing**: Markdown + tiktoken

### Directory Structure
```text
RAG_Service/context-engine/
├── app/
│   ├── api/          # FastAPI Routes (Idea, Chat, Artifacts)
│   ├── core/         # App state, Configuration
│   ├── rag/
│   │   ├── chunking/    # Splitters (Markdown, Text, Tiktoken)
│   │   ├── embeddings/  # Embedding model providers
│   │   ├── retriever/   # Query logic, MMR, Similarity Search
│   │   ├── vectorstore/ # Qdrant integration
│   │   └── assembler/   # Assembling retrieved context for prompts
│   ├── langgraph/    # Graph state machines (PM Wizard, Context Engine)
│   ├── prompts/      # Refined prompt templates
│   ├── knowledge/    # Pre-loaded Zenix UI/UX context files (.md)
│   └── main.py       # Application Entrypoint
```

---

## 3. Prioritized Implementation Path

### Phase 1: RAG Foundation (Current)
1. **Markdown Chunking Logic**:
   - Build custom chunking strategies in `app/rag/chunking/` to properly split markdown files by headers (`#`, `##`) without breaking semantic meaning.
2. **Embeddings & Vector Store**:
   - Initialize Qdrant vector store in `app/rag/vectorstore/`.
   - Setup `app/rag/embeddings/` using Sentence Transformers or Google GenAI.
3. **Complete Data Folder Ingestion**:
   - The RAG system will ingest the *entire* `backend/src/features/ai/data/` folder (including `ui/` files, `context/` templates, and `Agents.md`). 
   - This ensures the AI always has access to the exact templates, rules, and formats for how to write output artifacts correctly.

### Phase 2: The "Idea" Ingestion Pipeline
1. **User Input Routing**:
   - Expose a FastAPI endpoint `POST /api/orchestrate/idea`.
   - Node.js backend routes the initial user idea directly to this endpoint.
2. **Context Retrieval**:
   - The RAG system embeds the user's idea and searches the Qdrant store for the most relevant architecture, tech stack, and UI/UX documentation.
3. **PM Wizard Graph Migration**:
   - Re-implement `conversational.service.js` (PM Wizard) into a LangGraph state graph in `app/langgraph/pm_wizard.py`.
   - The retrieved RAG context is injected directly into the PM Wizard's system prompt before asking the user follow-up questions.

### Phase 3: The 3-Iteration Self-Correction Loop (Artifact Generation)
1. **LangGraph Loop Architecture**:
   - The generation of context artifacts (e.g., `architecture.md`, `ui-tokens.md`) will be governed by a strict 3-iteration LangGraph loop in `context_engine.py`:
     1. **Prompt & Analyze**: Inject user prompt and RAG templates.
     2. **Generate**: LLM outputs the first draft of the artifact.
     3. **Check**: A secondary verification node analyzes the output to find missing data, deviations from the templates, or inconsistencies with the UI knowledge.
     4. **Fix**: If errors are found, the output is routed back to the LLM for correction.
     5. **Loop**: This process repeats for a maximum of 3 iterations before finalizing the artifact to guarantee impeccable quality.
2. **Sequential Streaming**:
   - Replicate the Node.js sequential streaming logic over FastAPI Server-Sent Events (SSE) or WebSockets to keep the frontend UI reactive.

### Phase 4: Context Consolidation (The 4-File Blueprint Strategy)
1. **Consolidated Output Structure**:
   - Instead of generating 11/12 individual files (e.g., separating token variables, styling rules, libraries, and roadmap tasks), Zenix will consolidate generated contexts into **4 core blueprints**:
     - **`agents.md`**: Behaviors, instructions, coding standards, library docs, and the build roadmap task list.
     - **`design.md`**: Design tokens, layout wrapping guidelines, visual parameters, and component specifications.
     - **`architecture.md`**: Directory layouts, database schema definitions, and server-side API endpoints.
     - **`project-overview.md`**: Product goals, core features, primary user flow, and vision.

### Phase 5: Editor-Specific Target Renaming (AI Integration Selector)
1. **AI Integration Presets in UI**:
   - Add a configuration dropdown above the generation panel enabling developers to select their AI editor (Cursor, Windsurf, Roo Code, Gemini CLI, etc.).
2. **File Renaming Logic**:
   - Map files automatically based on target editor conventions:
     - Cursor -> Export `agents.md` as `.cursorrules`
     - Windsurf -> Export `agents.md` as `.windsurfrules`
     - Roo Code / Cline -> Export `agents.md` as `.clinerules`
     - Gemini CLI -> Export `agents.md` as `GEMINI.md`
     - Copilot -> Export `agents.md` as `.github/copilot-instructions.md`
     - Generic -> Keep as `agents.md`

---

## 4. Integration Protocol (Node.js <-> Python)

The existing Node.js backend will act as a thin proxy for AI requests.
- Node.js handles **Authentication** (Firebase JWT) and **Database CRUD** (MongoDB).
- Node.js forwards validated payloads to `http://localhost:8000/...` (Python RAG Service).
- Python RAG handles **Vector Search, LangGraph Execution, and LLM Generation**, streaming the results back to Node.js (or directly to the client via a shared token).

---

## 5. Reference: The Old Node.js Workflow

For historical context, this is how the legacy Node.js AI orchestration (`backend/src/features/ai`) functioned before the Python RAG migration:

1. **The Wizard (Conversational / Refinement)**: 
   - A user submits an idea. The `conversational.service.js` handles asking clarifying questions. It uses string matching (like `.includes("react native")`) to automatically map out the tech stack, platform, and UI style into the MongoDB `Brief`.
   - Once all questions are answered, `refinement.service.js` synthesizes everything into one massive `refinedSpec` string.
2. **Artifact Generation (The Bottleneck)**:
   - `artifacts.service.js` creates empty placeholders in the database for `AGENTS.md`, `TASKS.md`, and all `context/` files.
   - The backend dynamically reads **all** the markdown files inside `data/ui/` (color theory, animations, etc.) and `data/context/` using `fs.readFile` and stuffs them all directly into the system prompt before calling the LLM. 
3. **Developer Workspace**:
   - `developer.service.js` runs an interactive chat sandbox. Zenix responds in JSON format containing a conversational `message` and an `updates` array to push live file edits.

---

## 6. API Key Management (Free Tier Strategies)

We are utilizing free tier APIs (Groq, Mistral, Google Gemini). To prevent rate-limiting and separate concerns, API keys are scoped explicitly by feature:

*   **Primary Keys (e.g., `GROQ_API_KEY`)**: 
    Used strictly for the **Context Engine** (chunking, RAG generation, core artifact generation, and the developer chat workspace).
*   **Secondary Keys (e.g., `GROQ_API_KEY_II`)**: 
    Isolated exclusively for the **AI Playground**. The Playground allows users to converse back-and-forth to generate dynamic HTML/Tailwind Design Systems (`DESIGN.md` templates). Using the `_II` keys ensures playground traffic does not cannibalize rate limits for the core project generation engine.
