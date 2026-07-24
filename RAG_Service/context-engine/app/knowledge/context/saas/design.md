# ScribbleBox SaaS Design System, Tokens, Layout Rules, and Component Registry

This document is the single source of truth for every interface, interaction, and component inside ScribbleBox SaaS. Every design decision should reinforce clarity, consistency, and trust for software builders and SaaS workspace users.

---

# Part 1: Core Principles & Golden Rules

## Simplicity
Design should reveal only what the user needs in the current moment. Hide unnecessary complexity, reduce cognitive load, and guide users one decision at a time without sacrificing power.

## Fluidity
Every interaction should feel connected. Elements should transform naturally instead of appearing or disappearing abruptly, helping users always understand where they came from and where they're going.

## Delight
Delight should be intentional, not constant. Small moments of thoughtful animation, feedback, and surprise create emotional connection without distracting from the user's task.

## Consistency
Users should never have to relearn the interface. Similar actions, layouts, and components should always behave in predictable ways.

## Accessibility
Accessibility is a design requirement, not a feature. Every interface should be usable by as many people as possible regardless of ability or device.

## Performance
Fast interfaces build trust. Every interaction should feel lightweight, responsive, and free of unnecessary delays.

---

## Golden Rules

Every design should:
- Focus on one primary action.
- Reveal complexity progressively.
- Reuse existing components.
- Preserve user context.
- Explain changes through motion.
- Prioritize readability.
- Respect accessibility.

---

# Part 2: Design Tokens

Never hardcode colors, spacing, typography, radius values, or shadows. Always use these design tokens:

## Design Personality

ScribbleBox SaaS should feel:
- playful
- warm
- handmade
- personal
- scrapbook-inspired yet developer-first

The UI should feel like a physical notebook or sketchbook rather than a cold enterprise dashboard.

## Colors

### Brand & Accent Colors
* **Primary Purple** (`{colors.primary-purple}`): `#6E56CF` (Primary CTA buttons, active tab states, FAB button, selected highlights)
* **Lavender Background** (`{colors.accent-lavender}`): `#F2ECFF` (Home, workspace welcome, and settings backgrounds)
* **Peach Background** (`{colors.accent-peach}`): `#FFE8D2` (Organize onboarding background)
* **Mint Background** (`{colors.accent-mint}`): `#E6F5EA` (Remember onboarding background)
* **Cream Surface** (`{colors.surface-cream}`): `#FFF8EE` (Cards, inputs, auth screens)
* **Soft White** (`{colors.surface-white}`): `#FFFFFF` (Main page surfaces)
* **Danger Coral** (`{colors.accent-coral}`): `#FF6B57` (Delete buttons, destructive triggers)
* **Success Green** (`{colors.semantic-success}`): `#5CBF88` (Success states and validation glyphs)
* **Text Primary** (`{colors.text-primary}`): `#1F1F1F` (Headings, primary body labels)
* **Text Secondary** (`{colors.text-secondary}`): `#6B7280` (Subtitles, captions, metadata)
* **Border Color** (`{colors.border-line}`): `#E8E5F0` (Card borders, dividers)
* **Sidebar Surface Dark** (`{colors.sidebar-dark}`): `#18181B` (240px Fixed Sidebar)
* **Mascot Box Color**: `#D8A15B`
* **Mascot Box Outline**: `#6B4B2A`

## Typography

### Font Family
* **Primary Font**: Plus Jakarta Sans
* **Fallback Font**: Inter
* **Monospace Font**: JetBrains Mono

## Font Sizes
* Display XL: `40px`
* Display: `32px`
* Heading 1: `28px`
* Heading 2: `24px`
* Heading 3: `20px`
* Body Large: `18px`
* Body: `16px`
* Caption: `14px`
* Tiny: `12px`

## Font Weights
* Medium: `500`
* SemiBold: `600`
* Bold: `700`
* ExtraBold: `800`

## Border Radius
* Screen Cards: `32px`
* Primary Cards: `24px`
* Inputs: `18px`
* Buttons: `18px`
* Small Tags: `14px`
* FAB / Pill CTAs: `999px`

## Spacing Scale
* XS: `4px`
* SM: `8px`
* MD: `16px`
* LG: `24px`
* XL: `32px`
* 2XL: `48px`
* 3XL: `64px`

## Shadows
* **Card Shadow**: `0 8px 20px rgba(0,0,0,0.08)`
* **Floating Shadow**: `0 12px 32px rgba(0,0,0,0.12)`

## Animation Duration
* Fast: `150ms`
* Normal: `250ms`
* Slow: `400ms`

---

# Part 3: Design Template Specifications (ScribbleBox Workspace Canvas)

The chrome — top nav, body type, sidebar, primary CTA — is monochrome or obsidian. Headlines are oversized `{typography.display-xl}` set in Plus Jakarta Sans with aggressive negative tracking, body copy hovers around 16px–18px, and small mono `{typography.eyebrow}` and `{typography.caption}` labels (JetBrains Mono, all-caps, positive tracking) act as section markers. Every CTA is a pill — `{rounded.pill}` — and the primary action across the entire workspace is the same purple `{components.button-primary}` paired with the same cream `{components.button-secondary}`.

What makes the design unique is what happens **between** those bookends: the page repeatedly drops into oversized pastel **color-block sections** — lime, lavender, cream, mint, peach, and coral — that span the full content width with `{rounded.lg}` corners and `{spacing.xxl}` interior padding. These blocks are where the storytelling lives. They aren't accents tucked into a card; they take over a whole viewport's worth of vertical space, like a designer arranging giant sticky notes on a clean wall.

This is a system built on contrast: the obsidian/monochrome chrome makes the color blocks feel intentional rather than decorative, and the color blocks make the chrome feel like editorial paper rather than enterprise SaaS. Density is generous, line-heights are tight on display sizes, and the interface never reaches for heavy drop shadows or gradient clutter to do the work that color blocks and confident typography already do.

### Key Characteristics:
- Monochrome/obsidian system core: `{colors.primary-purple}` and `{colors.surface-white}` carry every CTA, body line, and navigation link.
- Oversized pastel **color-block sections** (`{colors.accent-lavender}`, `{colors.accent-peach}`, `{colors.accent-mint}`, `{colors.surface-cream}`, `{colors.accent-coral}`) define the narrative rhythm of every long-form workspace view.
- Pill is the only button shape — `{rounded.pill}` for text CTAs, `{rounded.full}` for icon buttons. No square buttons anywhere.
- Plus Jakarta Sans variable typeface used at fine weight increments (400, 500, 600, 700, 800) — the type system reads as a single voice that flexes.
- Tight negative letter-spacing on display sizes (-0.02em at 40px) creates a confident editorial cadence.
- JetBrains Mono reserved for category labels, eyebrows, code blocks, and context document previews — always uppercase, positive tracking — to flag taxonomy without competing with display type.

---

# Part 4: Marketing & Workspace Typography Matrix

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 40px | 800 | 1.10 | -0.02em | Hero headlines, wizard titles |
| `{typography.display-lg}` | 32px | 700 | 1.15 | -0.015em | Section opener headers |
| `{typography.headline}` | 24px | 700 | 1.25 | -0.01em | Card headers & story-block titles |
| `{typography.subhead}` | 20px | 600 | 1.30 | 0 | Long-form intro paragraphs |
| `{typography.card-title}` | 20px | 700 | 1.35 | 0 | Workspace tier titles, card titles |
| `{typography.body-lg}` | 18px | 500 | 1.55 | 0 | Lead body copy on hero |
| `{typography.body}` | 16px | 400 | 1.50 | 0 | Default body prose |
| `{typography.body-sm}` | 14px | 500 | 1.45 | 0 | Card body, table row details |
| `{typography.link}` | 16px | 600 | 1.40 | 0 | Inline link emphasis |
| `{typography.button}` | 16px | 600 | 1.40 | 0 | All pill buttons, primary and secondary |
| `{typography.eyebrow}` | 14px | 600 | 1.30 | 0.04em | JetBrains Mono uppercase section eyebrows |
| `{typography.caption}` | 12px | 500 | 1.00 | 0.04em | JetBrains Mono uppercase captions, table heads |

---

# Part 5: Visual Styling & Layout Rules

These rules define how every screen should be designed. If a UI decision conflicts with this section, these rules win:

## Design Principles
* **The Scrapbook Test**: Before shipping any screen, ask: "Does this feel like a scrapbook made by a thoughtful designer?" If the answer is no, it must be redesigned. Avoid sterile enterprise looks.
* **Visual Language**: The interface should feel calm, modern, editorial, and premium. Visual design should support content instead of competing with it. Every element must have a purpose.
* **Layout Structure**: Screens must follow: Header / Sidebar -> Hero Overview -> Content Card -> Main Workspace Feed.
* **Typography Hierarchy**: Use weight, not size, to carry hierarchy on body copy. Tighten line-heights on display sizes and keep it generous on body copy.
* **Text-Wrapping Safety**: Content rows owning full-width children must explicitly use `w-full min-w-0` to avoid accidental shrink-to-fit collapsing. Keep body prose measure between 45–75 characters per line.
* **Illustration Placement**: Mandatory for onboarding slides, signup portals, empty states, and clear-data panels. Mascot styles must utilize transparent backgrounds, soft pastel colors, and hand-drawn outlines.
* **Density & Touch Targets**: Always choose more whitespace, less clutter, and large touch targets (minimum `44px`).
* **Empty State Rules**: Every empty state must display a warm illustration, a friendly human-centric headline (e.g. "Your workspace is empty", "Nothing pinned yet"), a descriptive block, and an action button.
* **Home Dashboard Layout**: Fixed 240px sidebar, greeting header, pinned memory lists, recent screenshot thumbnails, and clear quick actions.
* **Prohibited Layout Styles**: Neumorphism, glassmorphism clutter, default Material Design boxes, tiny unreadable tables, complex multi-level menus, and overloaded screens.

## Layout & Grid
* **Base Unit**: 8px spacing system.
* **Whitespace Philosophy**: White space makes color blocks feel deliberate. Between every colored panel and the next, the page returns to white canvas with section breathing room. Inside a color block, give type generous side margins.

## Elevation & Depth Matrix
* **Level 0 (flat)**: No shadow, no border. Used for color-block sections, footer, and hero views.
* **Level 1 (hairline)**: 1px `{colors.border-line}` border on `{colors.surface-white}`. Used for cards and input fields.
* **Level 2 (soft elevation)**: Drop shadow `0 8px 20px rgba(0, 0, 0, 0.08)`. Used for template tiles and dropdown menus.
* **Level 3 (modal)**: Strong shadow `0 12px 32px rgba(0, 0, 0, 0.12)`. Used for lightboxes and overlay dialogues.

## Shapes & Radii
* Image frames use `{rounded.md}` (8px).
* Rounded corners should create consistency, not variety. No square buttons anywhere.

---

# Part 6: UI Component Registry

Always use these component structures. Duplicate component declarations are not allowed:

## Buttons
* **`button-primary`**: The purple pill CTA. Background `{colors.primary-purple}`, text `{colors.surface-white}`, type `{typography.button}`, padding 10px 20px, rounded `{rounded.pill}`.
* **`button-secondary`**: Cream pill with dark text. Background `{colors.surface-cream}`, text `{colors.text-primary}`, type `{typography.button}`, padding 8px 18px 10px, rounded `{rounded.pill}`.
* **`button-tertiary-text`**: Plain text link styled as a button hit target. Background `{colors.surface-white}`, text `{colors.text-primary}`, type `{typography.link}`, rounded `{rounded.full}`, padding `{spacing.xs}` `{spacing.sm}`.
* **`button-icon-circular`**: 40px circular icon button. Background `{colors.surface-cream}`, text `{colors.text-primary}`, rounded `{rounded.full}`, size 40px.
* **`button-danger`**: Coral background `{colors.accent-coral}`. Used for deletion and wiping data.

## Cards & SaaS Widgets
* **CollectionCard**: Staggered cover preview image, title, and screenshot count badge. Must not resemble standard file explorer folders.
* **ScreenshotCard**: Image preview thumbnail, saved timestamp, and optional bookmark pin marker.
* **PinnedMemoryCard**: Horizontal hero display container holding screenshot preview, description, and date.
* **Sidebar**: Fixed 240px desktop width sidebar holding workspace switcher, main navigation links, and user profile avatar.
* **DataTable**: SaaS data table with search bar, header sorting, dense row padding (`py-3 px-4`), and pagination controls.
* **MessageScroller**: Turn-anchored AI developer sandbox container displaying generated markdown context files (`Agents.md`, `architecture.md`).

## Inputs
* **SearchInput**: Simple single-input text field for global query filters.
* **NoteInput**: Multiline sketchbook-style text input for attaching thoughts to memories.
* **TextInput**: Basic input field with hairline borders and rounded corners. Background `{colors.surface-cream}`, text `{colors.text-primary}`, rounded `18px`, padding 12px 14px.

---

# Part 7: Responsive Behavior & Gutters

## Breakpoints Matrix
* **4k (1920px)**: Max content width holds at 1280px; gutters expand.
* **Desktop-XL (1440px)**: Default desktop layout with 240px fixed sidebar.
* **Tablet (960px)**: Sidebar collapses to a mobile drawer toggle.
* **Mobile (560px)**: Headlines reduce from 40px to ~28px; pill CTAs go full-width.

## Do's and Don'ts
* **DO**: Pair `button-primary` and `button-secondary` whenever a section needs both a primary action and a secondary action.
* **DO**: Allow the page to return to white canvas between color blocks so each block reads as deliberate.
* **DON'T**: Don't introduce mid-gray text. Body hierarchy comes from weight, not from opacity.
* **DON'T**: Don't add heavy drop shadows to color-block sections.
* **DON'T**: Don't square off CTAs. Square buttons read as a different brand.
* **DON'T**: Don't put monospace fonts in normal body copy.
