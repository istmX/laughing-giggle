# ScribbleBox SaaS Agent Instructions & Operating Rules

You are working on ScribbleBox SaaS.

Before making ANY implementation decisions, read every file inside the repository-relative `RAG_Service/context-engine/app/knowledge/context/saas` directory.
The context files are the source of truth.
Never make assumptions that contradict the context documents.

---

# What Is ScribbleBox SaaS?

ScribbleBox SaaS is a multi-tenant screenshot memory journal and development workspace platform.

It is NOT:
- a generic file gallery app
- a raw file manager
- an unorganized cloud bucket
- a sterile productivity tool
- a bloated enterprise dashboard

It IS:
- a structured memory box & SaaS workspace
- a screenshot journal with deep context retention
- a scrapbook archive
- a personal & team archive
- an AI-powered software context generator

Users save screenshots and project ideas because they represent something meaningful.
The purpose of ScribbleBox SaaS is to preserve the context behind screenshots and software project visions.
A screenshot without context is just an image.
A screenshot with context becomes a memory.
A project prompt without architecture is just rough text.
A project prompt with AI context becomes an actionable build blueprint.

---

# Core Product Philosophy

The product should feel:
- playful
- welcoming
- personal
- human
- emotional
- developer-first

The product should NOT feel:
- corporate
- enterprise-sterile
- sterile
- technical for the sake of being technical
- productivity-focused without warmth

---

# Design Philosophy

Every screen should feel like:
"A scrapbook made by a thoughtful designer for software builders."

The visual identity is inspired by:
- sketchbooks
- journals
- scrapbooks
- notebooks
- memory boxes
- clean developer workspaces

Avoid:
- glassmorphism clutter
- neumorphism
- overly futuristic UI
- enterprise dashboards
- dense, unreadable interfaces

---

# Development Priorities

Priority order:
1. User Experience
2. Design Consistency
3. Simplicity
4. Performance
5. Code Quality
6. Scalability

Never sacrifice UX for architecture complexity.

---

# Storage Philosophy

Images and project specifications are stored via the backend API in MongoDB or PostgreSQL.
The app supports local memory curation features, but authenticated project-chat, multi-tenant workspace sharing, and context-generation require backend connectivity.
Do not introduce unrelated architectural layers unless explicitly requested.

---

# Illustration Rules

Illustrations are a first-class part of the product.
All illustrations live inside:
`context/assets/`

Design references live inside:
`context/designs/`

Illustrations must:
- use transparent backgrounds
- follow the ScribbleBox mascot style
- use soft pastel colors
- use hand-drawn outlines
- remain consistent across the app

---

# Empty State Rules

Every empty state requires:
1. Illustration
2. Title
3. Description
4. Primary Action

Never leave users staring at blank screens.

---

# Progress Tracking

Whenever work is completed:
Update:
`context/progress-tracker.md`
This is mandatory.

---

# If Unsure

Always choose:
- simpler architecture
- fewer dependencies
- better UX
- local-first solutions

Never over-engineer.

---

# Code Standards

## Purpose

This section defines how code should be written inside ScribbleBox SaaS.
Consistency is more important than personal preference.
When uncertain:
Follow these standards.

## Core Principles

Write code for humans first.
Write code for machines second.
The next developer should understand the code without explanation.

## Preferred Style

Always prefer:
- readability
- simplicity
- maintainability

Avoid:
- clever code
- unnecessary abstractions
- premature optimization

## File Size Rules

### Component Files
Target: < 200 lines
Hard Limit: 300 lines

### Screen Files
Target: < 300 lines
Hard Limit: 500 lines

### Store Files
Target: < 250 lines

## Component Rules

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

## Naming Conventions

### Components
PascalCase
Example:
`CollectionCard.tsx`
`PinnedMemoryCard.tsx`
`WorkspaceSidebar.tsx`

### Hooks
useSomething
Example:
`useCollections.ts`
`useWorkspace.ts`

### Stores
something.store.ts
Example:
`collections.store.ts`
`workspace.store.ts`

### Types
something.types.ts
Example:
`collection.types.ts`
`tenant.types.ts`

## Folder Structure

```text
src/
├── app/                        # Next.js App Router / Vite Routes
│   ├── (auth)/                 # Auth routes (login, register)
│   ├── (dashboard)/            # SaaS Workspace routes
│   └── api/                    # REST API route handlers
├── features/                   # Feature-based modules
│   ├── home/
│   ├── collections/
│   ├── sandbox/                # AI Context Generator & MessageScroller
│   ├── timeline/
│   ├── settings/
│   ├── auth/
│   └── screenshots/
├── shared/                     # Shared design system components
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
└── lib/                        # Infrastructure config
```

Each feature owns:
- components
- hooks
- services
- types

## State Management

Use Zustand only.
Do not introduce:
- Redux
- MobX
- Recoil
- Context-based global state
unless explicitly required.

## Async Operations

Use TanStack Query.
Examples:
- importing screenshots
- loading collections
- multi-tenant workspace backups
- AI context generation jobs

Avoid manual loading state management.

## TypeScript Rules (Scoped to TS Packages)

For packages using TypeScript:
- Strict mode is enabled.
- Avoid using `any`.
- Never use `// @ts-ignore` unless absolutely necessary.

## Styling Rules & Text-Wrapping Safety

Before adding or changing frontend UI:
- **Web Frontend**: Use standard Tailwind CSS utility classes and Vanilla CSS variables.
- **Parent Width**: Content rows owning full-width children must explicitly use `w-full min-w-0` to avoid shrink-to-fit collapsing.
- **Prose Measure**: Keep body paragraph lengths between 45–75 characters per line.
- **Word Wrapping**: Do not use `overflow-wrap: anywhere` for normal body copy. Reserve `anywhere` strictly for long unbroken URLs or identifiers.
- **Semantic Tokens**: Never hardcode colors directly in components. Always use CSS variable tokens (`bg-canvas`, `bg-surface-elevated`, `text-ink`, `border-hairline`, `accent-primary`).

## Reusable Components

Before creating a component ask:
Can an existing component be reused?
Duplicate UI is not allowed.

## Error Handling

Every async action must:
- Handle errors
- Handle loading states
- Handle empty states

## Comments

Only write comments when:
The reasoning is not obvious.
Never comment obvious code.

Good:
Explain WHY.

## Imports Order

1. React
2. Libraries
3. Internal Components
4. Hooks
5. Types
6. Styles

## Performance

Avoid:
- unnecessary re-renders
- expensive computations
- large object creation in render

Use memoization only when necessary.

## Golden Rule

Readable code beats clever code.

---

# Library Documentation

## Approved Libraries & References

### Next.js / Vite
Purpose: Application framework & routing.
Responsibilities:
- page routing
- static & SSR builds
- API route handlers
Documentation: https://nextjs.org / https://vitejs.dev

### Zustand
Purpose: Global state.
Responsibilities:
- workspace collections
- settings
- active tenant selection
Rules: Keep stores small (<250 lines).
Documentation: https://zustand-demo.pmnd.rs

### TanStack Query
Purpose: Async state.
Responsibilities:
- query caching
- mutation invalidation
- optimistic UI updates
Documentation: https://tanstack.com/query

### Tailwind CSS & Class Utilities
Purpose: Utility styling.
Responsibilities:
- design tokens integration
- responsive breakpoints
- utility class merging (`clsx`, `tailwind-merge`)
Documentation: https://tailwindcss.com

### Lucide React
Purpose: Icons.
Rules: Use Lucide React icons only. Do not mix icon packs.
Documentation: https://lucide.dev

### React Hook Form & Zod
Purpose: Form management & schema validation.
Used For:
- Login / Registration forms
- Collection creation
- Context notes & workspace settings
Documentation: https://react-hook-form.com / https://zod.dev

### Groq SDK / Mistral API
Purpose: AI Orchestration.
Used For:
- Refinement wizard execution
- AI context document generation (`Agents.md`, `architecture.md`, `build-plan.md`)

## Library Whitelist Matrix

### Web Frontend
- `react`, `react-dom` (Core Framework)
- `next` / `vite` (App Framework & Bundler)
- `react-router-dom` (Routing for Vite)
- `zustand` (State Management)
- `@tanstack/react-query` (Async Fetching & Caching)
- `tailwindcss`, `tailwind-merge`, `clsx` (Styling & Utilities)
- `lucide-react` (Icons)
- `gsap`, `@gsap/react` (Animations & Timelines)
- `framer-motion` (Transition Animations)
- `react-hook-form`, `zod` (Forms & Validation)

### Backend
- `express` (Node.js Server)
- `mongoose` / `prisma` (Database ORM)
- `postgresql` / `mongodb` (Database Storage)
- `jsonwebtoken`, `bcryptjs` (Security & Authentication)
- `groq-sdk` (AI Model Orchestration)
- `cors`, `dotenv` (System Utilities)

## Library Philosophy

Before installing a dependency ask:
Can this be solved with existing libraries?
If yes: Do not install another package.
Keep the dependency graph small.
Keep maintenance simple.

---

# Build Plan

## Purpose

Defines the implementation order for ScribbleBox SaaS.
Features should be built in this exact sequence.
Do not skip ahead.

## Phase 1: Project Setup
Status: Planned
Tasks:
- Create Next.js / Vite project
- Configure TypeScript
- Configure Tailwind CSS & Vanilla CSS design tokens
- Configure ESLint & Prettier
Deliverable: Clean running project foundation.

## Phase 2: Design System & Tokens
Status: Planned
Tasks:
- Implement brand colors & semantic tokens
- Implement typography scales
- Implement spacing & corner radius tokens
- Implement reusable pill buttons (`Button.tsx`)
- Implement reusable cards (`Card.tsx`)
Deliverable: Reusable design system foundation.

## Phase 3: Illustration & Asset Integration
Status: Planned
Tasks:
- Add onboarding illustrations
- Add auth illustrations
- Add empty state illustrations
Deliverable: All brand assets integrated.

## Phase 4: Onboarding & Multi-Tenant Setup
Status: Planned
Tasks:
- Welcome Screen
- Workspace Setup Screen
- Organize Screen
Deliverable: Complete onboarding & workspace initialization.

## Phase 5: Authentication & Session Engine
Status: Planned
Tasks:
- Auth provider setup (Clerk / Supabase)
- Google & Email login
- Protected route middleware & session hooks
Deliverable: Working authentication & tenant protection.

## Phase 6: Navigation & Workspace Layout
Status: Planned
Tasks:
- 240px fixed sidebar navigation
- Header bar & mobile navigation drawer
- Protected route guards
Deliverable: Workspace layout complete.

## Phase 7: SaaS Collections & Memory Cards
Status: Planned
Tasks:
- Collection database model
- Collection cards & visual list
- Create collection workflow
Deliverable: Users can organize memories into workspace collections.

## Phase 8: Screenshot Context Importer
Status: Planned
Tasks:
- File upload & drag-and-drop importer
- Media storage integration
- Metadata creation & API service
Deliverable: Screenshots & context notes can be imported.

## Phase 9: Memory Details & Context Editor
Status: Planned
Tasks:
- High-res image preview
- Context note editor
- Pin status toggle
- Tag metadata display
Deliverable: Memory creation & context workflow complete.

## Phase 10: AI Refinement Wizard & Context Generator
Status: Planned
Tasks:
- Refinement wizard dialog (`QuestionCard` with choices)
- AI model orchestrator (`groq-sdk` / Mistral API integration)
- Developer Chat Sandbox (`MessageScroller`)
- Markdown Context exporter (`Agents.md`, `architecture.md`, `build-plan.md`)
Deliverable: Working AI Context Generation engine.

## Phase 11: Home Dashboard
Status: Planned
Tasks:
- User greeting
- Pinned memories widget
- Recent AI generations widget
- Empty state illustrations
Deliverable: Functional dashboard view.

## Phase 12: Timeline & Search
Status: Planned
Tasks:
- Calendar view & date grouping
- Full-text search across notes & tags
- Empty state illustration
Deliverable: Journal & search experience complete.

## Phase 13: Tenant Settings & Profile
Status: Planned
Tasks:
- Workspace team permissions
- Storage usage widget
- Data export & clear data trigger
Deliverable: Full workspace settings complete.

## Phase 14: Polish & Performance Verification
Status: Planned
Tasks:
- GSAP / Framer Motion animations
- Accessibility & keyboard navigation audit
- Responsive layout verification
- Production build verification (`npm run build`)
Deliverable: Production-ready ScribbleBox SaaS application.

## MVP Definition

SaaS MVP includes:
✓ Onboarding & Workspace Setup
✓ Authentication
✓ Import Screenshots & Context Notes
✓ Workspace Collections
✓ AI Refinement Wizard & MessageScroller Sandbox
✓ Timeline & Search
✓ Workspace Settings

Anything else is optional.

## Out of Scope

Not SaaS MVP:
- Real-time multiplayer canvas editing
- Automated OCR image extraction
- Billing & Stripe subscription webhook handling
Ignore these until requested.
