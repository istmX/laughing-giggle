# Code Standards

## Purpose

This file defines how code should be written inside ScribbleBox.

Consistency is more important than personal preference.

When uncertain:

Follow this file.

---

# Core Principles

Write code for humans first.

Write code for machines second.

The next developer should understand the code without explanation.

---

# Preferred Style

Always prefer:

- readability
- simplicity
- maintainability

Avoid:

- clever code
- unnecessary abstractions
- premature optimization

---

# File Size Rules

Component Files

Target:

< 200 lines

Hard Limit:

300 lines

---

Screen Files

Target:

< 300 lines

Hard Limit:

500 lines

---

Store Files

Target:

< 250 lines

---

# Component Rules

Every component should have:

Single responsibility

Bad:

One component that handles:

- fetching
- rendering
- forms
- business logic

Good:

Separate responsibilities.

---

# Naming Conventions

Components

PascalCase

Example:

CollectionCard.tsx

PinnedMemoryCard.tsx

---

Hooks

useSomething

Example:

useCollections.ts

useImportScreenshot.ts

---

Stores

something.store.ts

Example:

collections.store.ts

settings.store.ts

---

Types

something.types.ts

Example:

collection.types.ts

screenshot.types.ts

---

# Folder Structure

features/

home/

collections/

timeline/

settings/

auth/

onboarding/

screenshots/

Each feature owns:

- components
- hooks
- services
- types

---

# State Management

Use Zustand only.

Do not introduce:

Redux

MobX

Recoil

Context-based global state

unless explicitly required.

---

# Async Operations

Use TanStack Query.

Examples:

- importing screenshots
- loading collections
- backups

Avoid manual loading state management.

---

# TypeScript Rules (Scoped to TS Packages)

For packages using TypeScript:
- Strict mode is enabled.
- Avoid using `any`.
- Never use `// @ts-ignore` unless absolutely necessary.

*Note: For the web frontend and backend modules, standard JavaScript (ES Modules) is used.*

---

# Styling Rules (Package Bound)

- **Web Frontend**: Use standard Tailwind CSS utility classes and Vanilla CSS. Use components styled via className variables.
- **Mobile Client**: Use NativeWind utility classes and avoid large inline styles or giant StyleSheet files.

---

# Reusable Components

Before creating a component ask:

Can an existing component be reused?

Duplicate UI is not allowed.

---

# Error Handling

Every async action must:

Handle errors

Handle loading states

Handle empty states

---

# Comments

Only write comments when:

The reasoning is not obvious.

Never comment obvious code.

Bad:

// increment count

count++

Good:

Explain WHY.

---

# Imports

Order:

1. React
2. Libraries
3. Internal Components
4. Hooks
5. Types
6. Styles

---

# Performance

Avoid:

unnecessary re-renders

expensive computations

large object creation in render

Use memoization only when necessary.

---

# Golden Rule

Readable code beats clever code.