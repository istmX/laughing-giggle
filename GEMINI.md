# agents.md

# Zenix — AI Agent Working Instructions

This document defines how AI coding agents should understand, architect, and implement Zenix.

Everything written here is considered project context.

Never ignore these rules.

---

# Project Overview

Zenix transforms rough software ideas into complete, implementation-ready development context for AI coding agents.

Instead of repeatedly explaining a project to different AI tools, users describe their idea once.

Zenix analyzes the project, identifies missing requirements, structures the architecture, and generates a complete AI-ready development context.

The generated context becomes a single source of truth that can be used with any AI coding tool.

Examples include:

- agents.md
- architecture.md
- build-plan.md
- ui-rules.md
- ui-tokens.md
- code-standards.md
- implementation missions
- development roadmap
- technical documentation

The goal is consistency.

Every AI coding assistant should understand the project exactly the same way.

---

# Core Product Principles

The product should always feel:

- Professional
- Developer-first
- Minimal
- Premium
- Fast
- Predictable
- Structured

Never make the application feel like a generic AI chatbot.

Users are building software, not chatting.

Everything should feel like a professional development workspace.

---

# Primary User Flow

User enters an idea.

↓

Zenix analyzes the project.

↓

Requirements are completed automatically.

↓

Architecture is generated.

↓

Development plan is generated.

↓

AI implementation missions are generated.

↓

Context becomes usable inside any AI coding assistant.

---

# Supported AI Tools

Generated context should work with any AI coding environment.

Examples include:

- OpenAI Codex
- Claude Code
- Gemini CLI
- Cursor
- Windsurf
- GitHub Copilot
- Continue
- Roo Code
- Cline
- Any Markdown-based AI workflow

Never optimize for only one AI provider.

---

# Development Principles

Always prefer:

- Maintainability
- Scalability
- Readability
- Reusability
- Type safety where applicable
- Predictable architecture

Never write code only because it works.

Write code that another engineer can immediately understand.

---

# Planning Before Coding

Never immediately start implementing.

Before writing code:

1. Understand the feature.
2. Understand dependencies.
3. Break the feature into small tasks.
4. Explain the implementation plan.
5. Ask questions if information is missing.
6. Only then begin implementation.

Never guess requirements.

If anything is unclear, ask.

---

# Feature Development Process

Every feature should follow this workflow:

Understand

↓

Plan

↓

Break into tasks

↓

Implement task-by-task

↓

Verify

↓

Refactor

↓

Update progress.md

Never implement multiple unrelated features together.

---

# Folder Structure

Use Feature-Based Architecture.

Never place business logic inside pages.

Recommended structure:

src/

pages/
login/
signup/
dashboard/
projects/
settings/

features/

auth/
api/
hooks/
store/
ui/
utils/
constants/
types/
index.js

projects/
api/
hooks/
store/
ui/
utils/
constants/
types/
index.js

dashboard/
api/
hooks/
store/
ui/
utils/
constants/
types/
index.js

missions/

documents/

settings/

shared/

components/
hooks/
layouts/
providers/
services/
utils/
constants/
types/

assets/

lib/

Every feature owns its own:

- API
- Hooks
- Store
- Constants
- Types
- UI
- Utilities

Only reusable components belong inside shared/components.

Never place feature-specific components inside shared.

---

# Pages

Pages should remain extremely small.

Pages only render feature components.

Example:

pages/login

↓

renders

features/auth/Login

No business logic inside pages.

No API calls inside pages.

No state management inside pages.

Pages are routing layers only.

---

# Component Rules

Keep components focused.

One responsibility.

If a component grows too much, split it.

Avoid giant files.

Prefer composition over complexity.

---

# File Length

No source file should exceed approximately 150 lines whenever reasonably possible.

If a file becomes too large:

Split it.

Extract:

- hooks
- components
- helpers
- utilities
- constants

Never create 400-line React components.

---

# State Management

Keep state local whenever possible.

Lift state only when required.

Global state should only exist when multiple features genuinely require it.

Avoid unnecessary global stores.

---

# Constants

Never hardcode values.

Create constants for:

- routes
- labels
- navigation
- limits
- validation
- animation values
- configuration
- default settings

Use dedicated constants folders.

---

# Styling Rules

Never hardcode:

- colors
- spacing
- typography
- border radius
- shadows

Always use design tokens.

Use values defined in the project's design system.

---

# React Guidelines

Use the latest React patterns.

Prefer:

- functional components
- hooks
- composition
- reusable abstractions

Avoid outdated patterns.

---

# API Layer

Keep networking isolated.

Never call APIs directly inside UI components.

Use dedicated API modules.

---

# Hooks

Business logic belongs inside hooks whenever appropriate.

Components should primarily render UI.

---

# Reusability

Before creating something new:

Check whether it already exists.

Avoid duplicate components.

Avoid duplicate utilities.

Avoid duplicate logic.

---

# Error Handling

Never silently fail.

Provide clear loading, empty, success, and error states.

---

# Accessibility

Every UI should include:

- semantic HTML
- keyboard navigation
- proper labels
- focus states
- accessible buttons
- accessible forms

Accessibility is required.

---

# Performance

Prefer:

- lazy loading
- code splitting
- memoization when justified
- optimized rendering

Never optimize prematurely.

Optimize obvious bottlenecks.

---

# Documentation

Write clear code.

Prefer descriptive names.

Avoid unnecessary comments.

When complex logic exists, document the reasoning rather than the syntax.

---

# Progress Tracking

A file named:

progress.md

exists in the project.

It starts empty.

After completing meaningful work:

Update progress.md with:

- completed work
- current status
- pending work
- blockers
- next tasks

This file acts as long-term memory for AI agents.

---

# When Stuck

Never invent requirements.

Never guess.

Stop.

Ask questions.

Wait for clarification.

Then continue.

---

# Definition of Done

A task is complete only when:

- Feature works correctly
- Code follows project architecture
- No hardcoded values
- Components are reusable
- Folder structure is respected
- Pages remain thin
- Documentation is updated
- progress.md is updated

Only then should the task be considered finished.
