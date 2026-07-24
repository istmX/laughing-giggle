# ScribbleBox Visual Portfolio Project Overview

## Product Name

ScribbleBox Visual Portfolio

---

# Vision

ScribbleBox Visual Portfolio presents screenshot memory archives, creative developer work, design systems, and case studies in a 60fps, high-impact visual showcase.

People create extraordinary software, design systems, and memory archives.
Most static portfolio pages fail to capture the visual craftsmanship.
Visitors have no idea:
- why the work was created
- what technical depth was involved
- how the interaction details feel

ScribbleBox Visual Portfolio solves this by presenting case studies with high-contrast typography, interactive category filters, and smooth motion reveals.

---

# Problem Statement

Modern portfolio websites often suffer from design flaws:
- boring, plain unstyled text dumps
- slow, heavy database load times
- uninspired layout structures without visual rhythm
- weak typography hierarchy and lack of touch target safety

Visitors leave within seconds.

---

# Solution

Every project and memory archive becomes a visual showcase:
- 16:9 aspect thumbnail frames + category filter tags + hover card glow = **High-Impact Case Study**
- Space Grotesk display headings + Archivo prose + GSAP scroll reveals = **Memorable Showcase**

---

# Target Audience

Primary Users:
- Creative Developers & Engineers
- UI/UX Designers & Product Designers
- Creative Directors & Design Agencies

Secondary Users:
- Hiring Managers & Recruiters
- Open-Source Collaborators

---

# Core User Journey (Showcase Exploration)

Visitor lands on portfolio URL
       ↓
Floating glassmorphic navbar sits at top; Hero displays gradient headline & primary CTA
       ↓
Visitor scrolls down to Gallery section
       ↓
Visitor clicks category filter tab (`All`, `Web App`, `Design System`, `3D & Motion`)
       ↓
Cards animate via GSAP stagger reveal with interactive glow hover effect (`box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)`)
       ↓
Visitor clicks project card to inspect slide-over drawer or external live site

---

# Primary Screens & Viewport Sections

1. Floating Glassmorphic Header Navigation
2. Hero Banner & Gradient Headline
3. Interactive Project Gallery & Filter Engine
4. Technical Skills Matrix
5. Career Milestones & Experience Timeline
6. Contact & Social Connect Footer

---

# Header & Hero Section

Purpose:
Create an immediate, high-trust first impression.

Contains:
- floating glassmorphic nav bar (`bg-surface/80 backdrop-blur-xl rounded-2xl`)
- gradient brand logo (`AC`)
- headline (`Space Grotesk 72px`) with gradient fill (`gradient-text`)
- Archivo lead body copy
- primary action button ("View My Work") and secondary action button ("Download CV")
- social media icon buttons (GitHub, LinkedIn, Twitter)

---

# Project Gallery & Filter Section

Purpose:
Allow visitors to explore creative projects by domain.

Contains:
- category filter tabs (`All`, `Web App`, `Design System`, `3D & Motion`)
- 3-column project grid on desktop
- 16:9 thumbnail cards with hover scale (`scale-102`) and blue glow shadow
- technology stack badges (`React`, `TypeScript`, `GSAP`, `Tailwind`)
- live demo & code links

---

# Technical Skills Matrix Section

Purpose:
Showcase technical expertise grouped by category.

Contains:
- skills grouped by domain (Frontend, Motion, Design System, Backend)
- high-contrast pill badges
- proficiency indicators

---

# Career Timeline Section

Purpose:
Detail career milestones and accomplishments.

Contains:
- clean vertical timeline layout
- company name, role title, and dates
- bullet points highlighting key achievements

---

# Contact & Social Connect Footer

Purpose:
Drive visitor inquiries and email contact.

Contains:
- email CTA form / mailto trigger
- social media links
- copyright statement

---

# Empty State Philosophy

Empty states are opportunities.
Every empty state displays:
- friendly visual icon
- title ("No projects found in this category")
- descriptive explanation
- action button ("Reset Filters")

---

# Success Metric

The portfolio succeeds when visitors can answer:
"Is this a world-class creative developer?"
with a clear "Yes" within 5 seconds.

---

# Progress Tracker Log

## 2026-07-24

### Completed

- Overhauled all 4 `portfolio/` files to 100% mirror root file depth, formatting, line count, and design quality.
- Embedded design tokens and UI specs from `knowledge/ui/projects/portfolio-dark/index.html` (Space Grotesk + Archivo fonts, `#0F172A` obsidian background, `#3B82F6` blue gradient accent, backdrop-blur floating navbars).
- Expanded `portfolio/agents.md` (400+ lines), `portfolio/architecture.md` (240+ lines), `portfolio/design.md` (280+ lines), and `portfolio/project-overview.md` (230+ lines).

### Verification

- Verified all 4 `portfolio/` context documents pass full depth & quality audit.
