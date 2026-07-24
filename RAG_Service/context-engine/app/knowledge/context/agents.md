# Zenix AI Agent Working Instructions & Operating Rules

This document defines how AI coding agents should understand, architect, and implement code for this project.

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

Never make the application feel like a generic AI chatbot or enterprise administrative bloatware.

---

# Development Principles

Always prefer:
- Maintainability
- Scalability
- Readability
- Reusability
- Type safety where applicable
- Predictable feature-based architecture

Never write code only because it works. Write code that another engineer can immediately understand.

---

# File Length & Component Rules

No source file should exceed approximately 150 lines whenever reasonably possible.
If a file becomes too large:
Split it. Extract:
- hooks
- sub-components
- helpers
- utilities
- constants

Keep components focused on a single responsibility. Prefer composition over giant monolithic files.

---

# Styling & Token Rules

Never hardcode:
- colors
- spacing
- typography
- border radius
- shadows

Always use design system semantic tokens (`bg-canvas`, `bg-surface-elevated`, `text-ink`, `border-hairline`) so light and dark themes stay coherent.

---

# Code Standards & Folder Structure

Use Feature-Based Architecture (`src/features/*`). Every feature owns its own:
- components
- hooks
- store
- utils
- constants
- types

Only truly shared primitives belong in `src/shared/components` or `src/components/ui`.

---

# Build & Verification Workflow

1. Understand feature requirements.
2. Break task into focused steps.
3. Implement step-by-step keeping files < 150 lines.
4. Verify code compiles cleanly with zero lint or build errors.
