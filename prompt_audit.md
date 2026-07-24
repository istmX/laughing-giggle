# Zenix RAG Context Engine — Architectural Defect & Prompt Audit (`prompt_audit.md`)

This document records the complete audit of weak prompts, hardcoded value bottlenecks, system flaws, and the blueprint workflow alignment required to achieve instant, high-fidelity context generation.

---

## 🛠️ Summary of System Bottlenecks & Flaws Identified

### 1. Hardcoded Tech Stack & Framework Enforcement
- **Locations**: `refinement_wizard.py` (lines 35–80), `context_engine.py` (lines 115–150), `refinement_prompt.py`.
- **Flaw**: Hardcoded exact tech stack choices (`Next.js 14+ App Router + TypeScript + Supabase Auth + Prisma/PostgreSQL + Recharts + Framer Motion + GSAP + Stripe + Vercel`) into system prompts.
- **System Impact**: Overrode user intent. If a user requested a Three.js portfolio, Python automation script, Expo mobile app, or Vue/Nuxt site, Zenix forced Next.js/Supabase/GSAP anyway.

### 2. Generic System Prompts Producing Identical Blueprint Output
- **Locations**: `context_engine.py` (lines 100–160).
- **Flaw**: Sent a single generic system prompt to all 4 concurrent generation tasks (`agents.md`, `design.md`, `architecture.md`, `project-overview.md`) without distinct file-level task directives.
- **System Impact**: When primary/backup LLMs timed out or faced ambiguity, all 4 files fell back to outputting identical `# Technical Specification` baseline text.

### 3. Obsolete / Broken Legacy Prompt Files
- **Locations**: `app/prompts/context_prompt.py` & `app/prompts/refinement_prompt.py`.
- **Flaw**: `context_prompt.py` requested 12 legacy JSON keys from an outdated architecture. `refinement_prompt.py` contained broken JavaScript syntax (`JSON.stringify`) inside Python.
- **System Impact**: Created dead code confusion and misled agents attempting to maintain prompt layers.

### 4. Weak Fallback Strings in Question Generator
- **Locations**: `pm_wizard.py` (lines 106 & 123).
- **Flaw**: Returned hardcoded static fallback question strings (`"What is the primary feature or workflow of your application?"`) on parsing glitches.
- **System Impact**: Broken interview loop, repeating the same generic question to the user regardless of project domain.

### 5. Excessive Timeout Caps & Uncaught Backup Exceptions
- **Locations**: `context_engine.py` (lines 160–180), `routes.py`.
- **Flaw**: Set tight 18s–35s timeouts for 500-line document compilation while backup providers lacked nested exception guards.
- **System Impact**: Triggered HTTP 500 Internal Server Errors and GitHub Codespaces 60s 504 Gateway Timeouts.

---

## 🎯 Master Architecture & Workflow Alignment (`workflow.md` & `context.png`)

To align 100% with `workflow.md` and `context.png`, the system must execute this 5-step dynamic pipeline:

```
[ 1. User Input ]
       ↓
[ 2. Reactive Gaps & Intent Evaluation ]
       • Analyze the exact user idea to identify missing technical details or flaws.
       • Ask high-value clarifying questions SPECIFIC ONLY TO THAT IDEA (no hardcoded fallback questions).
       ↓
[ 3. Master Specification Synthesis ]
       • Synthesize user choices into a unified Master Technical Specification (`refined_spec`).
       ↓
[ 4. Dynamic RAG Knowledge Engine Processing ]
       • Read pre-built domain blueprints from `app/knowledge/context/` (Portfolio, SaaS, Mobile).
       • Read design tokens, UI components, & animation rules from `app/knowledge/ui/`.
       ↓
[ 5. 4-File Blueprint Generation & Loop Verification ]
       • Generate 4 distinct files (`agents.md`, `design.md`, `architecture.md`, `project-overview.md`).
       • Run verification loop to ensure all files are complete and specialized.
       • Developer Chat Sandbox: User can chat, ask for tips, or update files live.
```

---

## 🔒 Verification & Compliance Mandate

1. **Zero Hardcoded Values**: All design tokens, frameworks, databases, and motion libraries must be dynamically derived from the user prompt and RAG knowledge catalogs.
2. **Dedicated Prompt Modules**: Every file (`agents.md`, `design.md`, `architecture.md`, `project-overview.md`) receives a distinct, specialized prompt.
3. **Instant Interactive Response**: Interactive Q&A turns must use Tier-1 fast models (Gemini 3.5 Flash / Groq) for guaranteed **1 to 3 second** response times.
