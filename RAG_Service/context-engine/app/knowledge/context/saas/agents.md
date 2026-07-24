# Zenix AI Agent Instructions & Operating Rules — Full-Stack SaaS Blueprint

You are working on Zenix SaaS platform projects.

Before making ANY implementation decisions, read every file inside the project context directory.
The context files are the source of truth.
Never make assumptions that contradict the context documents.

---

# What Is ScribbleBox SaaS?

ScribbleBox is a screenshot memory journal & workspace platform.

It is NOT:
- a generic file gallery
- an unorganized cloud bucket
- a sterile productivity tool

It IS:
- a structured memory box & SaaS workspace
- a screenshot journal with deep context retention
- a high-trust personal & team archive

---

# Core Product Philosophy

The product should feel:
- playful yet professional
- personal, clean, and developer-first
- visual, delightful, and human

The product should NOT feel:
- enterprise-sterile or overly generic
- bloated with slow, unnecessary features

---

# Design Philosophy & UI Rules

Inspired by elevated developer tools, modern dashboards, and scrapbooks:
- **Theme & Color Tokens**: Support Slate Obsidian (`#09090B`) / Clean White canvas with Electric Blue (`#3B82F6`) accents and rich semantic state badges.
- **Visual Polish**: Smooth glassmorphic highlights, crisp borders, and subtle micro-animations (powered by GSAP / Framer Motion).
- **Prose & Layout**: Use `w-full min-w-0` on text wrappers to prevent accidental shrink-to-fit line collapsing. Body copy must maintain readable line lengths (45–75 characters).

---

# Development Priorities & Code Limits

Priority order:
1. User Experience & Design Consistency
2. Simplicity & Readability
3. Performance
4. Type Safety & Scalability

### File Size Limits
- **Component Files** (`src/components/`, `src/features/*/ui/`): Target < 150 lines, Hard limit 200 lines.
- **Screen & Page Modules**: Target < 250 lines.
- **Store & API Modules**: Target < 150 lines.

---

# Technology Stack & Storage Philosophy

- **Frontend**: Next.js / Vite (React, TypeScript, Tailwind CSS, Lucide Icons).
- **State & Async**: Zustand for local/global state, TanStack Query for caching and async data fetching.
- **Backend & Database**: Express / Node.js backend with MongoDB / PostgreSQL (Prisma/Mongoose).
- **Authentication**: Clerk / Supabase Auth with JWT session management.

---

# Build Phases & Implementation Roadmap

## Phase 1: Environment & Foundation
- Setup TypeScript, Tailwind CSS, and core UI design tokens.
- Configure MongoDB / PostgreSQL schema drivers and server API routes.

## Phase 2: Auth & Navigation Architecture
- Implement protected routes, Clerk / Supabase Auth provider hooks.
- Build responsive layout with 240px fixed sidebar and mobile navigation.

## Phase 3: SaaS Workspaces & Dashboard Features
- Build multi-tenant memory collections, screenshot importer, and contextual notes.
- Integrate data tables with sorting, filtering, and pagination.

## Phase 4: Polish, Security & Production
- Audit row-level security / API permissions.
- Optimizations: lazy loading, code splitting, zero layout thrashing.
- Verify production build.
