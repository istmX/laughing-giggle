# ScribbleBox Visual Portfolio & Showcase Design System, Tokens, Layout Rules, and Component Registry

This document is the single source of truth for every interface, interaction, and component inside ScribbleBox Visual Portfolio & Showcase applications. Every design decision should reinforce aesthetic excellence, visual impact, typography authority, and motion delight for creative developers, designers, and agencies.

---

# Part 1: Core Principles & Golden Rules

## Simplicity

Design should reveal only what the user needs in the current moment. Hide unnecessary complexity, reduce cognitive load, and guide users one decision at a time without sacrificing visual power.

---

## Fluidity

Every interaction should feel connected. Elements should transform naturally instead of appearing or disappearing abruptly, helping visitors always understand where they came from and where they are going.

---

## Delight

Delight should be intentional, not constant. Small moments of thoughtful animation (GSAP scroll reveals, card hover glows, button pill fills) create emotional connection without distracting from the portfolio case studies.

---

## Consistency

Users should never have to relearn the interface. Similar actions, layouts, and components should always behave in predictable ways.

---

## Accessibility

Accessibility is a design requirement, not a feature. Every interface should be usable by as many people as possible regardless of ability or device.

---

## Performance

Fast interfaces build trust. Every interaction should feel lightweight, responsive, and free of unnecessary delays (zero heavy backend database bottlenecks).

---

## Golden Rules

Every portfolio design MUST:

- Focus on one primary action per view (e.g. "View Project Case Study" or "Let's Talk").

- Maintain strict text-wrapping safety (`w-full min-w-0` on flex/grid parent containers).

- Guarantee readable line measures (45–75 characters per line for body copy).

- Never hardcode color hex values directly in components; always reference design system semantic tokens.

- Maintain accessible color contrast ratios (> 4.5:1 for normal text).

- Use 60fps GPU-accelerated motion transforms (`opacity`, `transform`) without layout thrashing.

---

# Part 2: Design Tokens & Palette Specifications

Never hardcode colors, spacing, typography, radius values, or shadows. Always use these design tokens:

---

## 1. Aesthetic Personalities & Palette Variants

ScribbleBox Visual Portfolio supports 4 distinct art-direction theme palettes:

### Palette Variant A: Dark Obsidian & Electric Neon (Default Showcase)

- **Canvas Base (`--bg-canvas`)**: `#0F172A` (Slate Obsidian) / `#09090B` (Pure Dark)

- **Surface Elevated (`--surface-elevated`)**: `#1E293B` (Elevated Card Ground)

- **Primary Ink (`--text-primary`)**: `#F1F5F9` (High Contrast White)

- **Secondary Ink (`--text-muted`)**: `#94A3B8` (Slate Subtitles & Captions)

- **Primary Accent (`--accent-primary`)**: `#3B82F6` (Electric Blue)

- **Secondary Accent (`--accent-purple`)**: `#8B5CF6` (Electric Violet)

- **Gradient Fill**: `linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)`

- **Hairline Border (`--border-line`)**: `rgba(255, 255, 255, 0.08)`

---

### Palette Variant B: Editorial Monochromatic Paper (Minimalist Showcase)

- **Canvas Base (`--bg-canvas`)**: `#F7F7F7` (Off-White Editorial Canvas)

- **Surface Elevated (`--surface-elevated`)**: `#FFFFFF` (Clean Card Surface)

- **Primary Ink (`--text-primary`)**: `#000000` (Deep Black)

- **Secondary Ink (`--text-muted`)**: `#666666` (Slate Gray)

- **Primary Accent (`--accent-primary`)**: `#000000` (Monochrome Pill)

- **Hairline Border (`--border-line`)**: `#E2E2E2`

---

### Palette Variant C: Cyberpunk Neon & Emerald (Developer Showcase)

- **Canvas Base (`--bg-canvas`)**: `#050811` (Deep Space Dark)

- **Surface Elevated (`--surface-elevated`)**: `#0D1527`

- **Primary Accent (`--accent-primary`)**: `#10B981` (Emerald Green)

- **Secondary Accent (`--accent-cyan`)**: `#06B6D4` (Cyan Glow)

- **Gradient Fill**: `linear-gradient(135deg, #10B981 0%, #06B6D4 100%)`

- **Hairline Border (`--border-line`)**: `rgba(16, 185, 129, 0.15)`

---

### Palette Variant D: Glassmorphic Sunset (Creative Director Showcase)

- **Canvas Base (`--bg-canvas`)**: `#0D0B18` (Midnight Violet)

- **Surface Elevated (`--surface-elevated`)**: `rgba(255, 255, 255, 0.04)`

- **Primary Accent (`--accent-primary`)**: `#F43F5E` (Rose Pink)

- **Secondary Accent (`--accent-orange`)**: `#FB923C` (Sunset Orange)

- **Gradient Fill**: `linear-gradient(135deg, #F43F5E 0%, #FB923C 100%)`

---

## 2. Typography Scale Matrix

### Approved Font Family Pairings:

1. **Option A (Default)**: Space Grotesk (Headlines) + Archivo / Inter (Body Copy)

2. **Option B (Editorial)**: Bebas Neue / Satoshi (Headlines) + Outfit / Plus Jakarta Sans (Body Copy)

3. **Option C (Monospace Label Tagging)**: JetBrains Mono (Eyebrows, Category Badges, Code Snippets)

| Token Name | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| `{typography.display-xl}` | clamp(2.5rem, 6vw, 4.5rem) | 700 (Bold) | 1.05 | -0.02em | Hero banner display headlines |
| `{typography.display-lg}` | clamp(2.0rem, 4vw, 3.0rem) | 700 (Bold) | 1.10 | -0.015em | Section opener headers |
| `{typography.headline}` | 28px | 600 (SemiBold) | 1.25 | -0.01em | Project card titles & story block headers |
| `{typography.subhead}` | 20px | 500 (Medium) | 1.35 | 0 | Lead subhead prose |
| `{typography.card-title}` | 20px | 700 (Bold) | 1.35 | 0 | Feature titles, case study titles |
| `{typography.body-lg}` | 18px | 400 (Regular) | 1.55 | 0 | Lead body copy on hero sections |
| `{typography.body}` | 16px | 400 (Regular) | 1.50 | 0 | Default body prose |
| `{typography.body-sm}` | 14px | 500 (Medium) | 1.45 | 0 | Card descriptions, footer link lists |
| `{typography.link}` | 16px | 600 (SemiBold) | 1.40 | 0 | Inline link emphasis |
| `{typography.button}` | 16px | 600 (SemiBold) | 1.40 | 0 | All pill buttons, primary and secondary |
| `{typography.eyebrow}` | 14px | 600 (SemiBold) | 1.30 | 0.04em | JetBrains Mono uppercase section eyebrows |
| `{typography.caption}` | 12px | 500 (Medium) | 1.00 | 0.04em | JetBrains Mono uppercase tag captions |

---

## 3. Spacing, Curvature & Elevation Tokens

- **Grid System**: 8px spatial rhythm (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).

- **Corner Radius Scale**:
  - Floating Navbar: `16px` (`rounded-2xl`).
  - Project Case Study Cards: `24px` (`rounded-3xl`).
  - Input Fields & Modal Drawers: `18px`.
  - Pill Buttons & Badges: `9999px` (`rounded-full`) or `12px` (`rounded-xl`).

- **Elevation & Shadow Matrix**:
  - **Level 0 (Flat)**: No shadow. Used for color-block sections and hero canvas.
  - **Level 1 (Hairline)**: 1px border stroke (`border-white/5` or `border-hairline`).
  - **Level 2 (Hover Glow)**: `box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)`. Used on project card hover states.
  - **Level 3 (Modal Overlay)**: Heavy shadow `0 20px 50px rgba(0, 0, 0, 0.5)` + `backdrop-filter: blur(20px)`.

---

# Part 3: Design Template Specifications (Portfolio Dark Canvas)

The chrome — top nav, body type, footer, primary CTA — is dark obsidian. Headlines are oversized `{typography.display-xl}` set in Space Grotesk with gradient fill (`gradient-text`), body copy hovers around Archivo 18px–20px, and small mono `{typography.eyebrow}` acts as section markers.

Between those bookends, the showcase drops into 16:9 aspect project cards and color-block case studies featuring card glow hover effects (`box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)`).

### Key Characteristics:

- Floating glassmorphic navbar: `bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/5`.

- Gradient text highlights: `background: linear-gradient(135deg, #3B82F6, #8B5CF6); -webkit-background-clip: text;`.

- Interactive card glow: Smooth hover scale (`scale-102`) paired with blue shadow glow.

- Space Grotesk display headings paired with Archivo body copy.

---

# Part 4: Visual Styling & Layout Rules

These rules define how every screen should be designed. If a UI decision conflicts with this section, these rules win:

## Design Principles

* **The Showcase Test**: Ask: "Does this feel like a 60fps creative director portfolio?" If no, redesign it.

* **Layout Structure**: Screens must follow: Floating Nav -> Hero -> Project Gallery -> Skills Matrix -> Experience Timeline -> Contact Footer.

* **Text-Wrapping Safety**: Content rows owning full-width children must explicitly use `w-full min-w-0` to avoid accidental shrink-to-fit collapsing. Keep body prose measure between 45–75 characters per line.

* **Density & Touch Targets**: Always choose more whitespace, less clutter, and large touch targets (minimum `44px`).

* **Empty State Rules**: Every empty state must display a warm illustration/icon, title, descriptive block, and action button.

* **Whitespace Philosophy**: White space makes visual projects feel deliberate. Inside a project card, give type generous interior margins.

* **Prohibited Layout Styles**: Neumorphism, glassmorphic clutter without purpose, default Material Design boxes, unstyled data lists, and cramped layouts.

---

# Part 5: Comprehensive UI Component Registry & Structural Constraints

Always use these component structures:

## Navigation & Headers

* **`HeaderNav`**: Floating glassmorphic navbar (`top-6 left-6 right-6 z-50 bg-surface/80 backdrop-blur-xl rounded-2xl`). Must contain brand gradient logo on the left, navigation link items in center, and primary CTA button on the right edge.

* **`MobileNavDrawer`**: Slide-over drawer navigation for mobile viewports (<768px). Must use smooth backdrop blur and list navigation links vertically with 16px row gaps.

---

## Buttons & Interactive Controls

* **`button-primary`**: Background `#3B82F6`, hover `#2563EB`, text `#FFFFFF`, rounded `12px`, padding 12px 24px. Must include hover background color transition (200ms duration).

* **`button-secondary`**: Border `border-white/10`, hover `border-white/20`, text `#F1F5F9`, rounded `12px`. Must use transparent surface background with subtle border highlights.

* **`button-icon-social`**: 48px square/rounded icon button with surface background and primary border hover. Must centered-align vector SVG icons.

* **`FilterTabButton`**: Sliding filter tab button (`All`, `Web App`, `Design System`, `3D Motion`). Active state highlights with `--accent-primary` background or underline indicator.

---

## Cards & Showcase Grid

* **ProjectCard**: Aspect ratio 16:9 thumbnail frame, title, description, category tag, hover zoom (`scale-102`), and card glow shadow. Images must use `object-fit: cover` with overflow hidden.

* **FeaturedHeroCard**: Full-width 70vh cover banner displaying brand marquee, headline, and primary project preview. Must maintain 70vh viewport height on desktop screens.

* **SkillCard**: Categorized technical domain surface card holding skill pill badges (`React`, `TypeScript`, `GSAP`, `Tailwind`). Must group skills into separate visual rows.

* **TimelineCard**: Vertical timeline card holding role title, company name, date badge, and achievements. Must include left vertical border line connecting milestone nodes.

---

## Modals & Drawers

* **ProjectDetailModal**: Full slide-over drawer showing extended case study details, live links, GitHub URL, and tech stack tags. Must dim background with 50% opacity backdrop overlay.

---

# Part 6: Comprehensive GSAP Motion Constraints & Animation Rules

All motion MUST adhere to these performance parameters:

## 1. Section Scroll Reveal Rules
- Every main portfolio section (`.portfolio-section`) must trigger a scroll reveal.
- Entrance animation must translate up by 40px while animating opacity from 0 to 1 over an 800ms duration with `power2.out` easing.
- ScrollTrigger must set trigger point at `top 85%` of viewport.

## 2. Project Grid Stagger Rules
- Cards inside the project gallery grid (`.project-card`) must animate in sequence with a `0.1s` stagger delay.
- Individual card entrance duration must hold at 600ms with `power2.out` easing.

## 3. Hero Text Reveal Rules
- Hero headline (`.hero-title`) must translate up from 50px offset with a 1.0s duration and `power3.out` easing on initial page load.

---

# Part 7: Responsive Behavior & Breakpoints

- **4K Viewports (1920px+)**: Content max-width holds at `1280px` (`max-w-6xl mx-auto`).

- **Desktop (1024px - 1440px)**: 3-column project grid layout.

- **Tablet (768px - 1024px)**: 2-column project grid, navbar links collapse to hamburger drawer.

- **Mobile (<768px)**: 1-column project grid, display headlines reduce to `36px - 40px`, CTA buttons go full-width.

---

# Part 8: Expanded Design System Guidelines & Best Practices

## 1. Typography Hierarchy & Weight Rules

- Use weight, not size, to carry hierarchy on body copy (e.g. 18px body at weight 400 next to an 18px link at weight 600).

- Tighten line-heights on display sizes (1.05 - 1.10) and keep it generous on body copy (1.50 - 1.55).

---

## 2. Color Contrast & Accessibility Auditing

- Ensure all text against `#0F172A` or `#1E293B` surfaces passes WCAG AA contrast ratio of at least 4.5:1.

- Active states must never rely on color alone; always pair color changes with border highlights or icon state shifts.

---

## 3. Motion & Reduced Motion Safety

- Wrap all GSAP scroll triggers with `window.matchMedia('(prefers-reduced-motion: reduce)')` checks.

- When reduced motion is preferred, collapse animation durations to `0.01ms`.

---

## 4. Image Performance & Aspect Ratio Enforcements

- All project thumbnails must be rendered in 16:9 ratio frames with `overflow: hidden` and `object-fit: cover`.

- Always provide fallback SVG placeholder artwork if an image fails to load.

---

## 5. Copywriting & Tone of Voice

- Be concise, direct, and developer-first.

- Avoid generic jargon. Let the visual work speak for itself.

---

# Part 9: Showcase Component Specifications & Layout Constraints

## 1. Top Navbar Constraints

- Fixed positioning at top offset `24px` (`top-6`), inset `24px` left and right.
- Surface background must use 80% opacity with `backdrop-filter: blur(16px)` and 1px hairline stroke (`border-white/5`).
- Navbar container height holds at `64px` with horizontal padding `24px`.
- Brand logo must render as a high-contrast gradient mark (`gradient-text`).

---

## 2. Hero Section Layout Constraints

- Full viewport height (`min-h-screen`) flex layout with centered vertical alignment.
- Top padding `128px` (`pt-32`), bottom padding `80px` (`pb-20`).
- Headline typography must utilize Space Grotesk at `5xl` mobile size and `7xl` desktop size (`text-5xl md:text-7xl font-bold`).
- Lead description paragraph must hold max width `32rem` (`max-w-lg`) to enforce readable 45-75 character measures.
- Primary CTA button must feature right arrow icon with 8px horizontal gap (`gap-2`).

---

## 3. Project Showcase Card Constraints

- Grid container must render 3 equal columns on desktop (`grid-cols-3 gap-8`).
- Card container surface uses `#1E293B` (`bg-surface`) with 1px border stroke (`border-white/5`).
- Image frame enforces 16:9 aspect ratio (`aspect-video`). Hover trigger scales image `1.05` over 500ms duration.
- Card hover state applies blue glow shadow (`box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)`).
- Category tag must render uppercase JetBrains Mono eyebrow text (`text-xs font-semibold uppercase tracking-wider text-primary`).

---

# Part 10: Definition of Done & Quality Audit Checklist

A portfolio design is complete ONLY when:

1. **Aesthetic Impact**: Passes the 60fps creative showcase test with Space Grotesk typography, gradient text highlights, floating backdrop-blur nav, and hover card glow effects.

2. **Text-Wrapping Safety**: Zero shrink-to-fit text container crashes; line lengths hold between 45–75 characters.

3. **Performance**: Zero heavy backend dependencies; all content renders from static JSON files or local assets with GSAP scroll triggers.

4. **Accessibility**: All contrast ratios pass 4.5:1; reduced motion checks are strictly respected.
