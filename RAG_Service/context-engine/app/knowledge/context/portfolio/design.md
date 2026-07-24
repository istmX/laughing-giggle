# Zenix Design System Specification — Visual Portfolio & Showcase Blueprint

This document defines the visual system, design tokens, typography scale, component registry, and GSAP motion rules for ScribbleBox visual portfolios and showcases.

---

# 1. Design System Tokens & Layout Rules

1. **Text-Wrapping Safety**:
   - Explicitly use `w-full min-w-0` on text containers.
   - Keep body prose measure between 45–75 characters per line.
   - Use `overflow-wrap: break-word` (never `anywhere` on normal text).

2. **Typography Scale**:
   - Product Sans / Satoshi for display headlines, Outfit / Inter for body prose.

3. **Primitive & Semantic Color Tokens**:
   - **Canvas (`--bg`)**: `#121212` (Deep Obsidian Canvas) / `#F7F7F7` (Light Canvas)
   - **Canvas RGB (`--bg-rgb`)**: `18, 18, 18` (Glassmorphic blur base)
   - **Ink / Primary (`--fg` / `--primary`)**: `#FFFFFF` / `#000000`
   - **Surface Soft (`--surface`)**: `#1E1E1E`
   - **Hairline Border (`--border`)**: `#2A2A2A`
   - **Brand Accent (`--accent`)**: `#3B82F6` (Electric Blue Accent)

---

# 2. Layout, Spacing & Curvature Tokens

- **Corner Radius (`--radius`)**: `32px` Large Pill Radius across buttons, tags, and card wrappers.
- **Container Max-Width (`--container-max-width`)**: `1120px` (`max-w-5xl mx-auto w-full px-6`).
- **Section Rhythm (`--section-spacing`)**: `80px` vertical margin desktop, `48px` mobile.

---

# 3. Component Registry & Specifications

## Header Navigation (`HeaderNav.tsx`)
- **Sticky Glassmorphism**: `position: sticky; top: 0; z-index: 50; backdrop-filter: blur(16px) saturate(180%); background: rgba(var(--bg-rgb), 0.78);`

## Hero Section (`HeroSection.tsx`)
- Marquee brand ticker text loop.
- 70vh height cover banner media (`object-fit: cover`, radius `32px`).
- Category pill badge with pulsing accent dot.

## Primary & Secondary Pill Buttons (`Button.tsx`)
- Shared pill buttons using Product Sans font, `32px` corner radius, and hover micro-interactions.

---

# 4. GSAP Motion Blueprint

- Registered Plugins: `ScrollTrigger`, `@gsap/react`
- Section Scroll Reveals: Fade-in and translate-up (`opacity: 0, y: 40` to `opacity: 1, y: 0`).
- Card Stagger: `stagger: 0.1` on gallery grid items.
