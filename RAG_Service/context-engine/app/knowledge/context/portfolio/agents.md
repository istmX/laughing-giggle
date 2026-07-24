# ScribbleBox Visual Portfolio & Showcase Agent Instructions & Operating Rules

You are working on ScribbleBox Visual Portfolio and Showcase platform projects.

Before making ANY implementation decisions, read every file inside the repository-relative `RAG_Service/context-engine/app/knowledge/context/portfolio` directory.
The context files are the single source of truth.
Never make assumptions that contradict the context documents.

---

# What Is ScribbleBox Visual Portfolio?

ScribbleBox Visual Portfolio is a high-impact, visual showcase platform engineered for displaying screenshot memory archives, creative developer work, design systems, and case studies.

It is NOT:
- a static, boring list of links
- a generic resume page
- a slow, heavy backend database app
- a corporate, sterile corporate portal
- an unorganized media dump

It IS:
- a high-trust creative portfolio & showcase
- a sketchbook-inspired visual memory box
- a 60fps motion-enriched showcase gallery
- a personal & agency case study archive
- an interactive showcase built on Next.js/Vite, React, TypeScript, and GSAP

Users and clients explore portfolios to understand the vision, aesthetic taste, and craftsmanship behind software.
The purpose of ScribbleBox Visual Portfolio is to showcase projects with extraordinary visual polish, typography hierarchy, and fluid micro-animations.

---

# Core Product Philosophy

The product should feel:
- playful yet ultra-premium
- personal, clean, human, and developer-first
- visual, delightful, and emotional
- vibrant, dark-mode obsidian enriched with gradient accents (#3B82F6, #8B5CF6)

The product should NOT feel:
- enterprise-sterile or overly corporate
- bloated with slow, unnecessary backend database calls
- static or uninspired

---

# Design Philosophy & Aesthetic System

Every screen should feel like:
"A sketchbook showcase designed by a world-class creative director."

Visual Identity Inspiration & UI Catalog Rules:
- Space Grotesk / Bebas Neue / Satoshi display headlines paired with Archivo / Plus Jakarta Sans / Inter body copy
- Floating backdrop-blur navbars (`bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/5`)
- Dark Mode Obsidian Canvas (`#0F172A` / `#09090B`) with Electric Blue (`#3B82F6`) and Purple (`#8B5CF6`) gradient accents
- Interactive card glow hover effects (`box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)`)
- 70vh cover media banners with marquee trust loops (`★ CREATIVE DESIGN & HIGH-PERFORMANCE INTERFACES`)

Avoid:
- neumorphic clutter
- default browser font stacks
- generic unstyled tables
- claustrophobic layouts without breathing room

---

# Development Priorities

Priority order:
1. Visual Excellence & Aesthetic Impact
2. User Experience & Motion Fluidity
3. Simplicity & Performance
4. Code Quality & Maintainability
5. Responsive Flexibility

Never sacrifice visual excellence or motion responsiveness for unnecessary backend complexity.

---

# Storage & Data Philosophy

Visual portfolios operate on a zero-backend-bloat model.
All project entries, case studies, skill matrices, and experience timelines are served from static JSON files (`projects.json`, `skills.json`, `experience.json`) or lightweight client state.
Do not introduce database connections (MongoDB/PostgreSQL) unless explicitly requested.

---

# Illustration & Media Rules

Visual media is a first-class part of the portfolio.
All illustrations and cover media live inside:
`context/assets/` or high-resolution Unsplash design buffers.

Design references live inside:
`RAG_Service/context-engine/app/knowledge/ui/projects/portfolio-dark/`

Media elements must:
- use `object-fit: cover` with proper error fallback handlers
- follow 16:9 aspect ratios for project cards
- maintain 70vh banner heights on hero views
- utilize smooth zoom scale transformations (`group-hover:scale-102 transition-transform duration-500`)

---

# Empty State & Loading Rules

Every empty state requires:
1. Visual Illustration / Icon
2. Title (e.g., "No projects found in this category")
3. Friendly Description
4. Primary Action ("Reset Filters")

Never leave users staring at blank screens.

---

# Progress Tracking & Error Memory

Upon starting implementation on this project for the first time, the AI coding agent MUST create a file named `progress.md` in the project root.

### `progress.md` Lifecycle & Maintenance Rules:
1. **Initial Creation**:
   - Create `progress.md` if it does not exist.
   - Document project goals, completed features, current status, pending tasks, and next steps.
2. **Feature Updates**:
   - After completing every meaningful feature or task, update `progress.md` with what was implemented.
3. **Error Memory Log**:
   - Whenever an error, crash, or bug is encountered and resolved, add an entry to the **Error Memory Log** section in `progress.md`:
     - **Bug Description**: What broke or caused the exception.
     - **Root Cause Analysis**: Why it happened.
     - **Fix / Prevention Solution**: Exact resolution so future AI sessions solve it instantly.

---

# Code Standards


## Purpose

This section defines how code should be written inside ScribbleBox Visual Portfolio.
Consistency is more important than personal preference.
When uncertain:
Follow these standards.

## Core Principles

Write code for humans first.
Write code for machines second.
The next developer should understand the code without explanation.

## Preferred Style

Always prefer:
- visual polish
- simplicity
- maintainability

Avoid:
- clever spaghetti code
- unnecessary abstractions
- premature backend complexity

## File Size Rules

### Component Files
Target: < 150 lines
Hard Limit: 200 lines

### Section / Page Files
Target: < 200 lines
Hard Limit: 300 lines

### Store / Hook Files
Target: < 150 lines

## Component Rules

Every component should have:
Single responsibility

Bad:
One component that handles hero rendering, gallery filtering, modal logic, and contact form handling.

Good:
Separate feature modules (`HeroSection.tsx`, `GallerySection.tsx`, `ProjectCard.tsx`, `HeaderNav.tsx`).

## Naming Conventions

### Components
PascalCase
Example:
`ProjectCard.tsx`
`HeroSection.tsx`
`HeaderNav.tsx`

### Hooks
useSomething
Example:
`useGSAPScroll.ts`
`useGalleryFilter.ts`

### Stores & Types
something.store.ts / something.types.ts
Example:
`gallery.store.ts`
`project.types.ts`

## Folder Structure

```text
src/
├── app/                        # Next.js App Router / Vite Routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── features/                   # Feature-based architecture
│   ├── navigation/
│   ├── hero/
│   ├── gallery/
│   ├── skills/
│   ├── experience/
│   └── contact/
├── shared/                     # Shared design system components
│   ├── components/             # Reusable pill buttons, badges, wrappers
│   ├── hooks/                  # GSAP scroll hooks
│   └── constants/
└── data/                       # Content JSON Files
    ├── projects.json
    ├── skills.json
    └── experience.json
```

## State Management

Use Zustand for client state (active filter tab, modal open state, theme toggle).
Do not introduce Redux, MobX, or Recoil.

## Styling Rules & Text-Wrapping Safety

Before adding or changing frontend UI:
- **Design Tokens**: Always reference CSS variable tokens (`var(--bg)`, `var(--fg)`, `var(--primary)`, `var(--border)`).
- **Parent Width**: Content rows owning full-width children must explicitly use `w-full min-w-0` to avoid shrink-to-fit collapsing.
- **Prose Measure**: Keep body paragraph lengths between 45–75 characters per line.
- **Word Wrapping**: Do not use `overflow-wrap: anywhere` for normal body copy. Reserve `anywhere` strictly for long unbroken URLs or identifiers.
- **Typography Scale**: Space Grotesk / Bebas Neue for display headlines, Archivo / Outfit for body copy, JetBrains Mono for eyebrows and tags.

---

# Library Documentation & Whitelist Matrix

### Whitelisted Libraries:
- `react`, `react-dom` (Core Framework)
- `next` / `vite` (Framework & Bundling)
- `typescript` (Type Safety)
- `tailwindcss`, `tailwind-merge`, `clsx` (Styling)
- `gsap`, `@gsap/react` (Animations & ScrollTrigger)
- `framer-motion` (Micro-interactions)
- `lucide-react` (Icons)
- `zustand` (State Management)

---

# Build Plan

## Phase 1: Project Setup & Design System Setup
- Setup Next.js / Vite project with TypeScript and Tailwind CSS.
- Configure `globals.css` with dark mode tokens (`--bg: #0F172A`, `--surface: #1E293B`, `--primary: #3B82F6`, `--accent: #8B5CF6`, `--radius: 32px`).

## Phase 2: Floating Glassmorphic Header
- Build `HeaderNav` with `backdrop-blur-xl`, floating 24px margins, brand gradient logo (`AC`), navigation links, and "Let's Talk" CTA.

## Phase 3: Hero Section & Marquee Ticker
- Build `HeroSection` featuring Space Grotesk display headline, Archivo lead prose, gradient text fill (`gradient-text`), primary CTA pill button, and social link buttons.

## Phase 4: Project Gallery & Filter Engine
- Create `projects.json` dataset.
- Build `GallerySection` with sliding filter tabs (`All`, `Web App`, `Design System`, `3D & Motion`).
- Build `ProjectCard` sub-component with aspect-16:9 thumbnails, category badges, hover card glow (`box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)`), and slide-over modal trigger.

## Phase 5: Technical Skills Matrix & Career Timeline
- Build `SkillsSection` displaying skills grouped by domain with high-contrast badges.
- Build `ExperienceSection` showing career milestones in a clean vertical timeline.

## Phase 6: GSAP ScrollTrigger & Micro-Interactions
- Register GSAP `ScrollTrigger` and implement section scroll reveal animations (`opacity: 0, y: 40` to `opacity: 1, y: 0`).
- Implement button hover fill states and card zoom effects.

## Phase 7: Responsive Audit & Production Verification
- Verify layout across Mobile (<640px), Tablet (640px-1024px), and Desktop (>1024px).
- Verify production build compilation `npm run build`.

---

# MVP Definition & Out of Scope

Portfolio MVP includes:
✓ Floating Navbar & Hero Section
✓ Interactive Project Gallery with Filters
✓ Skills Matrix & Experience Timeline
✓ Contact Section & Social Links
✓ GSAP Scroll Animations

Out of Scope for MVP:
- Full E-commerce checkout integration
- Heavy database CMS admin portals
- User login / signup flows
