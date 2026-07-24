# Zenix AI Agent Instructions & Operating Rules — ScribbleBox Visual Showcase & Portfolio Blueprint

This document is the single source of truth for AI coding agents implementing ScribbleBox visual showcases, memory galleries, agency portfolios, or developer showcases.

Never make assumptions that contradict this document.

---

# Product Vision & Philosophy

This project is a high-impact, visual showcase platform engineered for ScribbleBox screenshot memories, showcase galleries, and developer tools.

The application MUST feel:
- **Playful, Personal & Human**: Sketchbook-inspired aesthetic combined with clean typography and high contrast.
- **Dynamic & Alive**: Smooth GSAP scroll-triggered reveals, micro-animations, hover fill states, and interactive filter tabs.
- **Fast & Lightweight**: Built on Next.js / Vite, React, TypeScript, and Tailwind CSS.
- **Predictable & Safe**: Single max-width container (`1120px`), consistent 32px pill corner radii, and strict component file limits.

---

# Strict Code Standards & Component Limits

1. **File Length Limits**:
   - Component Files (`src/components/`, `src/features/*/ui/`): Target < 150 lines, Hard Limit 200 lines. Split large components immediately into modular sub-components.
   - Page / Section Files (`src/app/`, `src/pages/`): Target < 200 lines, Hard Limit 300 lines.
   - Store / Hook Files (`src/stores/`, `src/hooks/`): Target < 150 lines, Hard Limit 200 lines.

2. **Typography Tokens & Text Wrapping Safety**:
   - Product Sans or Satoshi for display headlines, Outfit / Inter for body copy.
   - Use `w-full min-w-0` on flex/grid containers to prevent accidental text shrinking.
   - Maintain readable line lengths between 45–75 characters per line.
   - Never use `overflow-wrap: anywhere` for normal body copy.

3. **Color Tokens**:
   - Never hardcode hex colors directly in components. Reference CSS variable tokens (`var(--bg)`, `var(--fg)`, `var(--primary)`, `var(--surface)`, `var(--border)`, `var(--accent)`).

---

# Whitelisted Packages & Dependencies

- **Next.js / Vite React**: Core framework.
- **TypeScript**: Strict type safety.
- **Tailwind CSS**: Utility-first CSS engine.
- **GSAP & ScrollTrigger** (`gsap`, `@gsap/react`): Core animation engine, timeline sequencing, and scroll triggers.
- **Lucide Icons** (`lucide-react`): SVG icons.
- **Zustand** (`zustand`): Client UI state management.

---

# Implementation Roadmap & Build Phases

## Phase 1: Foundation & Design System Setup
- Configure Next.js / Vite with TypeScript and Tailwind CSS.
- Configure `index.css` with CSS design tokens (`--bg`, `--fg`, `--primary`, `--border`, `--radius: 32px`).

## Phase 2: Navigation & Hero Showcase
- Build `HeaderNav` with sticky glassmorphism (`backdrop-filter: blur(16px)`).
- Build `HeroSection` featuring marquee ticker, 70vh cover media banner, display headline, and primary pill button.

## Phase 3: Memory Showcase & Filter Engine
- Create projects/memories dataset.
- Build `GallerySection` with sliding filter tabs and `ProjectCard` sub-components.

## Phase 4: Motion & Polish
- Register GSAP `ScrollTrigger` and implement section scroll reveal animations (`opacity: 0, y: 30` -> `opacity: 1, y: 0`).
- Audit responsive layout and verify production build.
