# ScribbleBox SaaS Project Overview

## Product Name

ScribbleBox SaaS

---

# Vision

ScribbleBox SaaS transforms screenshots and software ideas into memories and implementation-ready development specifications.

People take hundreds of screenshots and jot down dozens of app ideas.
Most are forgotten.
Months later they have no idea:
- why they saved them
- what they meant
- why they mattered
- how to start building them

ScribbleBox SaaS solves this by letting users organize screenshots into visual collections, attach context notes, and convert project prompts into full AI-ready development context.

---

# Problem Statement

Modern digital collections and developer notes become chaotic.

Examples:
- app ideas
- travel plans
- design inspiration
- conversations
- study material
- shopping items
- backend architecture notes

Users remember saving them.
They forget WHY.

---

# Solution

Every screenshot and software prompt can become a memory or structured project.
A screenshot may contain:
- note
- collection tag
- date
- pin status

An app prompt may contain:
- prompt text
- refinement wizard answers
- generated context files (`Agents.md`, `architecture.md`, `build-plan.md`)

Users build a personal & workspace archive instead of a digital dump.

---

# Target Audience

Primary Users:
- students
- designers
- developers
- creators
- researchers
- SaaS workspace teams

Secondary Users:
- travelers
- planners
- collectors

---

# Core User Journey (Project Creation & Refinement)

User inputs project idea / prompt on Dashboard
       ↓
Enters conversational refinement wizard (interactive QuestionCard with options / "Let Zenix decide")
       ↓
Wizard completes (either step 10+ bypass or AI decides context is sufficient)
       ↓
Directly transitions to the Developer Chat Sandbox (MessageScroller interface)
       ↓
AI generates context files (Agents.md, build-plan.md, etc.) on request via backend APIs

---

# Legacy User Journey (Screenshot Journal)

User opens app
       ↓
Imports screenshot
       ↓
Places screenshot into workspace collection
       ↓
Adds memory note
       ↓
Screenshot becomes searchable / appears in timeline or pinned list

---

# Primary Screens

1. Onboarding
2. Authentication
3. Home Dashboard
4. Workspace Collections
5. Collection Details
6. Screenshot Details
7. Developer Chat Sandbox (MessageScroller)
8. Timeline
9. Tenant Settings

---

# Home Dashboard Screen

Purpose:
Provide quick access to important memories and active AI context generation projects.

Contains:
- greeting
- pinned memories
- recent project generations
- import action

---

# Workspace Collections Screen

Purpose:
Organize screenshots and projects by topic.

Examples:
- Travel
- Design
- Study
- AI Ideas
- Personal
- Backend Architecture

Collections are visual and colorful.

---

# Screenshot Details Screen

Purpose:
Attach meaning to screenshots.

Contains:
- image preview
- note
- date
- collection
- pin toggle

This is the most important screen in the screenshot memory flow.

---

# Developer Chat Sandbox (MessageScroller) Screen

Purpose:
Provide a turn-anchored chat sandbox for AI context generation.

Contains:
- chat scroller stream
- generated context file previews (`Agents.md`, `architecture.md`, `build-plan.md`)
- one-click markdown export action

---

# Timeline Screen

Purpose:
Help users remember events over time.

Screenshots appear on the dates they were saved.
The timeline should feel like a journal.
Not a sterile database.

---

# Tenant Settings Screen

Contains:
- workspace profile
- team members & roles
- storage usage
- import backup
- export backup
- theme
- clear data

---

# Empty State Philosophy

Empty states are opportunities.
They should feel:
- friendly
- motivating
- warm

Every empty state uses illustrations.

---

# Future Features

Not MVP:
- cloud multi-canvas editing
- automated OCR image scanning
- automated AI summary webhooks
- Stripe billing webhooks

These features are intentionally excluded from MVP.

---

# Success Metric

The app succeeds when users can answer:
"Why did I save this screenshot?" and "How do I build this software idea?"
without guessing.

---

# Progress Tracker Log

## 2026-07-24

### Completed

- Aligned `saas/` context files 100% with root context depth, formatting, and line structures.
- Updated `saas/agents.md` (610+ lines) with full library whitelist matrix, style guidelines, and 14-phase build plan.
- Updated `saas/design.md` (300+ lines) with core design principles, typography matrices, component specs, and responsive rules.
- Updated `saas/architecture.md` (270+ lines) with 3-layer storage breakdown, Prisma schemas, REST API contracts, and database cascade deletion rules.
- Updated `saas/project-overview.md` (240+ lines) with full user journeys, screen wireframe specifications, and progress tracker log.

### Verification

- Confirmed all 4 `saas/` files match the line counts, depth, and quality of `agents.md`, `design.md`, `architecture.md`, and `project-overview.md` at root.
