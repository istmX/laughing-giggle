# ScribbleBox Project Overview

## Product Name

ScribbleBox

---

# Vision

ScribbleBox transforms screenshots into memories.

People take hundreds of screenshots.

Most are forgotten.

Months later they have no idea:

- why they saved them
- what they meant
- why they mattered

ScribbleBox solves this by letting users organize screenshots and attach context.

---

# Problem Statement

Modern screenshot collections become chaotic.

Examples:

- app ideas
- travel plans
- design inspiration
- conversations
- study material
- shopping items

Users remember saving them.

They forget WHY.

---

# Solution

Every screenshot can become a memory.

A screenshot may contain:

- note
- collection
- date
- pin status

Users build a personal archive instead of a screenshot dump.

---

# Target Audience

Primary Users:

- students
- designers
- developers
- creators
- researchers

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
Places screenshot into collection
       ↓
Adds memory note
       ↓
Screenshot becomes searchable / appears in timeline or pinned list

---

# Primary Screens

1. Onboarding

2. Authentication

3. Home

4. Collections

5. Collection Details

6. Screenshot Details

7. Timeline

8. Settings

---

# Home Screen

Purpose:

Provide quick access to important memories.

Contains:

- greeting
- pinned memories
- recent screenshots
- import action

---

# Collections

Purpose:

Organize screenshots by topic.

Examples:

- Travel
- Design
- Study
- AI Ideas
- Personal

Collections are visual and colorful.

---

# Screenshot Details

Purpose:

Attach meaning to screenshots.

Contains:

- image preview
- note
- date
- collection
- pin toggle

This is the most important screen in the app.

---

# Timeline

Purpose:

Help users remember events.

Screenshots appear on the dates they were saved.

The timeline should feel like a journal.

Not a database.

---

# Settings

Contains:

- profile
- storage usage
- import
- export
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

- cloud sync
- OCR
- AI tagging
- AI summaries
- collaboration

These features are intentionally excluded.

---

# Success Metric

The app succeeds when users can answer:

"Why did I save this screenshot?"

without guessing.