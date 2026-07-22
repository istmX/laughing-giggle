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

# Collections Screen

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

# Screenshot Details Screen

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

# Timeline Screen

Purpose:
Help users remember events.

Screenshots appear on the dates they were saved.
The timeline should feel like a journal.
Not a database.

---

# Settings Screen

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

---

# Progress Tracker Log

## 2026-06-18

### Completed

- Read the project instructions and context documents before implementation.
- Installed approved MVP dependencies and Expo SDK 54-compatible native packages.
- Confirmed Expo dependency alignment with `npx expo install --check`.
- Configured NativeWind with Tailwind, Babel, Metro, global CSS, and TypeScript declarations.
- Added ScribbleBox design tokens for colors, typography, spacing, radius, and shadows.
- Updated the root layout to use the ScribbleBox background and NativeWind global styles.
- Replaced the placeholder app screen with a basic scrapbook-inspired ScribbleBox entry screen.
- Updated Expo app metadata from the template app name to ScribbleBox.
- Built backend conversational prompt engine with Groq integration, pre-filled AI guidelines, and "no manual typing" options constraints.
- Integrated standard design asset schemas including `color_theory.md`, `sans_serif_fonts.md`, `product_design.md`, `storytelling.md`, and `animations.md`.
- Implemented `MessageScroller` turn-anchoring, scroll-following, and prepending-preservation UI layout.
- Embedded `ProjectChatPage` developer playground directly inside the completed wizard route view.
- Added transactional cascade deletion in backend `project.service.js` to purge linked Ideas, Briefs, Tasks, Contexts, and Generations.

### Verification

- Frontend production build (`npm run build`) compiles cleanly with no errors.
- Backend conversational model orchestration endpoints verified.
- Database cascade deletes verified.

### Notes

- Designed spec output format explicitly targeting downstream AI developer agents.
- Wrapped all hex values inside `ui-tokens.md` in backticks for standard parser compliance.
