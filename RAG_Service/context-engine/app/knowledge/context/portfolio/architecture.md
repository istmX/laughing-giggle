# Zenix Architectural Specification — Visual Portfolio & Showcase Blueprint

This document defines the technical architecture, folder structure, content schemas, and client state layer for ScribbleBox visual portfolios and showcase platforms.

---

# 1. Architectural Principles & Boundaries

1. **Frontend-Driven Architecture**: Visual portfolios prioritize zero latency, high-fidelity rendering, and high SEO scores. Content is served via static JSON data files or client memory stores.
2. **Zero Backend Bloat**: No heavy backend APIs or complex WebSocket pipelines unless explicitly required.
3. **Feature-Based Folder Structure**: Modular organization across navigation, hero, gallery, skills, and contact features.

---

# 2. Technology Stack Selection

- **Framework**: Next.js App Router / Vite (React + TypeScript)
- **Styling**: Tailwind CSS with CSS Variable design system tokens
- **Motion & Animations**: GSAP (`gsap`, `@gsap/react`, `ScrollTrigger`) / Framer Motion
- **Icons**: Lucide React (`lucide-react`)
- **Client State**: Zustand (`zustand`) for active gallery filter tab, modal open state, and dark/light mode preference.

---

# 3. Core Folder Architecture

```text
src/
├── app/                        # Next.js App Router / Page Routes
│   ├── layout.tsx              # Root layout with font imports & metadata
│   ├── page.tsx                # Main single-page portfolio view
│   └── globals.css             # Tailwind base & CSS design tokens
├── features/                   # Feature-based modules
│   ├── navigation/             # Glassmorphic navbar
│   ├── hero/                   # Hero section & marquee banner
│   ├── gallery/                # Memory gallery & filter engine
│   ├── skills/                 # Skills matrix
│   └── contact/                # Footer contact section
├── shared/                     # Reusable design system components
│   ├── components/             # Pill buttons, badges, container wrappers
│   └── hooks/                  # GSAP scroll hooks
└── data/                       # Content JSON Files
    ├── projects.json
    └── skills.json
```

---

# 4. Data Layer & Schemas

### Project Content Schema (`src/data/projects.json`)
```json
[
  {
    "id": "memory-1",
    "title": "ScribbleBox Memory Journal",
    "category": "Web App",
    "description": "Screenshot context preservation app built with React, GSAP, and Tailwind CSS.",
    "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600",
    "tags": ["React", "TypeScript", "GSAP", "Tailwind"],
    "liveUrl": "https://example.com"
  }
]
```

---

# 5. Routing, Layout & Performance Rules

- **Single Max-Width Container**: Every section MUST use container wrapper (`max-w-5xl mx-auto w-full px-6`, max-width `1120px`).
- **Section Vertical Rhythm**: Every section MUST use section wrapper (`margin-bottom: 80px` desktop, `48px` mobile).
- **Responsive Media**: All project images MUST use `object-fit: cover` with fallback handlers.
