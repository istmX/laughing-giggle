# ScribbleBox Visual Portfolio Architectural Specification

## Architecture Goals

The ScribbleBox Visual Portfolio architecture should be:

- frontend-driven & zero-latency
- high-impact visual quality
- maintainable and modular
- static-first for maximum performance and SEO

Avoid unnecessary backend complexity.

---

# System Overview

Static Content (JSON Data / Client Media Assets)
       ↓
Next.js / Vite React Frontend Routes (Space Grotesk + Archivo Fonts, Tailwind CSS)
       ↓
GSAP Motion Engine & ScrollTrigger Observers
       ↓
Zustand Client UI Store (Active Filter Tabs, Lightbox Open State, Theme Preferences)
       ↓
Visual Portfolio Showcase Grid & Interactive Case Study Drawers

---

# Storage Layers

## Layer 1

Media & Image Assets

Technology:

Unsplash Design Buffers / Local Static Images

Stores:

- 70vh cover media banners
- 16:9 aspect project card thumbnails
- background texture maps

All images must use `object-fit: cover` with fallback error handlers to prevent broken image icons.

---

## Layer 2

Content Data Layer

Technology:

Static JSON Files (`projects.json`, `skills.json`, `experience.json`)

Stores:

- project entries (title, category, tags, live URLs, descriptions)
- skill matrices grouped by technical domain
- career milestones & experience timeline cards

---

## Layer 3

Client State Layer

Technology:

Zustand

Stores:

- active category filter tab (`All`, `Web App`, `Design System`, `3D & Motion`)
- slide-over project detail modal state
- contact modal open state

---

# Folder Structure

src/

app/

components/

features/

hooks/

services/

store/

types/

utils/

assets/

data/

---

# Feature Structure

features/

navigation/

hero/

gallery/

skills/

experience/

contact/

Each feature owns:

- components
- hooks
- types
- data/constants

Avoid giant shared folders.

---

# Data Schemas & Data Contracts

### Project Content Schema (`src/data/projects.json`)

```json
[
  {
    "id": "project-1",
    "title": "Interactive 3D Motion Showcase",
    "category": "3D & Motion",
    "description": "Interactive WebGL 3D showcase built with React, Three.js, GSAP, and Tailwind CSS.",
    "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600",
    "tags": ["React", "Three.js", "GSAP", "Tailwind"],
    "liveUrl": "https://example.com",
    "githubUrl": "https://github.com/example/project"
  }
]
```

### Skills Content Schema (`src/data/skills.json`)

```json
[
  {
    "category": "Frontend & UI",
    "items": ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5/CSS3"]
  },
  {
    "category": "Motion & Animation",
    "items": ["GSAP", "ScrollTrigger", "Framer Motion", "CSS Keyframes"]
  }
]
```

---

# State Management Rules

Use Zustand.

Do NOT use:

- Redux
- MobX
- Recoil

Keep stores focused.

Avoid monolithic stores.

---

# Navigation & Layout Boundaries

Floating Backdrop-Blur Navigation Bar:

- Fixed top positioning (`top-6 left-6 right-6 z-50`)
- Background `bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/5`
- Section links (`Work`, `About`, `Skills`, `Contact`)
- Primary action CTA (`Let's Talk`)

---

# Performance & Motion Rules

Use:

- GSAP `ScrollTrigger` for section scroll reveals (`opacity: 0, y: 40` to `opacity: 1, y: 0`)
- Image lazy-loading
- GPU-accelerated CSS transforms (`transform`, `opacity`)

Avoid:

- layout thrashing or animating width/height directly
- heavy unoptimized media assets

---

# Zero Backend Philosophy

Visual portfolios operate entirely without a database.
No MongoDB, Express API routes, or backend servers are allowed unless explicitly requested by the user.
Content updates are managed via git-backed JSON files.
