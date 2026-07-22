# ScribbleBox Design System, Tokens, Layout Rules, and Component Registry

This document is the single source of truth for every interface, interaction, and component. Every design decision should reinforce clarity, consistency, and trust.

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

ScribbleBox should feel:
- playful
- warm
- handmade
- personal
- scrapbook-inspired

The UI should feel like a physical notebook or sketchbook rather than a software dashboard.

## Colors

### Brand & Accent Colors
* **Primary Purple** (`{colors.primary-purple}`): `#6E56CF` (Primary CTA buttons, active tab states, FAB button, selected highlights)
* **Lavender Background** (`{colors.accent-lavender}`): `#F2ECFF` (Home, welcome, and settings backgrounds)
* **Peach Background** (`{colors.accent-peach}`): `#FFE8D2` (Organize onboarding background)
* **Mint Background** (`{colors.accent-mint}`): `#E6F5EA` (Remember onboarding background)
* **Cream Surface** (`{colors.surface-cream}`): `#FFF8EE` (Cards, inputs, auth screens)
* **Soft White** (`{colors.surface-white}`): `#FFFFFF` (Main page surfaces)
* **Danger Coral** (`{colors.accent-coral}`): `#FF6B57` (Delete buttons, destructive triggers)
* **Success Green** (`{colors.semantic-success}`): `#5CBF88` (Success states and validation glyphs)
* **Text Primary** (`{colors.text-primary}`): `#1F1F1F` (Headings, primary body labels)
* **Text Secondary** (`{colors.text-secondary}`): `#6B7280` (Subtitles, captions, metadata)
* **Border Color** (`{colors.border-line}`): `#E8E5F0` (Card borders, dividers)
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
* FAB: `999px`

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

# Part 3: Design Template Specifications (Figma Marketing Canvas)

Figma's marketing canvas is, at the system level, an editor-clean black-and-white frame. The chrome — top nav, body type, footer, primary CTA — is monochrome. Headlines are oversized `{typography.display-xl}` set in `figmaSans` with aggressive negative tracking, body copy hovers around weight 320–340 of the same variable family, and small mono `{typography.eyebrow}` and `{typography.caption}` labels (figmaMono, all-caps, positive tracking) act as section markers. Every CTA is a pill — `{rounded.pill}` — and the primary action across the entire site is the same black `{components.button-primary}` paired with the same white `{components.button-secondary}`.

What makes the design unique is what happens **between** those monochrome bookends: the page repeatedly drops into oversized pastel **color-block sections** — lime, lavender, cream, mint, pink, coral, and a deep navy — that span the full content width with `{rounded.lg}` corners and `{spacing.xxl}` interior padding. These blocks are where the storytelling lives. They aren't accents tucked into a card; they take over a whole viewport's worth of vertical space, like a designer arranging giant sticky notes on a clean wall. FigJam is the most pastel-saturated, the home page rotates through the full set, and the pricing page ends with a lime FAQ panel — same vocabulary, different rhythm per route.

This is a system built on contrast: the monochrome chrome makes the color blocks feel intentional rather than decorative, and the color blocks make the monochrome chrome feel like editorial paper rather than enterprise SaaS. Density is generous, line-heights are tight on display sizes, and the interface never reaches for shadows or gradients to do the work that color blocks and confident typography already do.

### Key Characteristics:
- Monochrome system core: `{colors.primary}` (black) and `{colors.canvas}` (white) carry every CTA, every body line, every footer link.
- Oversized pastel **color-block sections** (`{colors.block-lime}`, `{colors.block-lilac}`, `{colors.block-cream}`, `{colors.block-mint}`, `{colors.block-pink}`, `{colors.block-coral}`, `{colors.block-navy}`) define the narrative rhythm of every long-form page.
- Pill is the only button shape — `{rounded.pill}` for text CTAs, `{rounded.full}` for icon buttons. No square buttons anywhere.
- `figmaSans` variable typeface used at unusually fine weight increments (320, 330, 340, 450, 480, 540) — the type system reads as a single voice that flexes rather than a multi-weight family.
- Tight negative letter-spacing on display sizes (-1.72px at 86px, -0.96px at 64px) creates a confident editorial cadence.
- `figmaMono` reserved for category labels, eyebrows, and captions — always uppercase, positive tracking — to flag taxonomy without competing with display type.
- Color-block page rhythm (home): white hero → marquee strip → white feature → lime systems block → navy ship-products block → coral developer block → white template grid → white footer.

---

# Part 4: Marketing Typography Matrix

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 86px | 340 | 1.00 | -1.72px | Hero headlines (home, FigJam) |
| `{typography.display-lg}` | 64px | 340 | 1.10 | -0.96px | Section opener headlines |
| `{typography.headline}` | 26px | 540 | 1.35 | -0.26px | Story-block titles inside color blocks |
| `{typography.subhead}` | 26px | 340 | 1.35 | -0.26px | Long-form intro paragraphs at near-headline scale |
| `{typography.card-title}` | 24px | 700 | 1.45 | 0 | Pricing-tier titles, feature card titles |
| `{typography.body-lg}` | 20px | 330 | 1.40 | -0.14px | Lead body copy on hero, contact form labels |
| `{typography.body}` | 18px | 320 | 1.45 | -0.26px | Default body |
| `{typography.body-sm}` | 16px | 330 | 1.45 | -0.14px | Card body, footer link list |
| `{typography.link}` | 20px | 480 | 1.40 | -0.10px | Inline link emphasis |
| `{typography.button}` | 20px | 480 | 1.40 | -0.10px | All pill buttons, primary and secondary |
| `{typography.eyebrow}` | 18px | 400 | 1.30 | 0.54px | figmaMono uppercase section eyebrows |
| `{typography.caption}` | 12px | 400 | 1.00 | 0.60px | figmaMono uppercase captions, footer column heads |

## Font Family Substitutes

If implementing figmaSans / figmaMono without access, use **Inter** (or **Geist**) for the sans-serif and **JetBrains Mono** (or **Geist Mono**) for the mono-spaced roles.

---

# Part 5: Visual Styling & Layout Rules

These rules define how every screen should be designed. If a UI decision conflicts with this section, these rules win:

## Design Principles
* **The Scrapbook Test**: Before shipping any screen, ask: "Does this feel like a scrapbook?" If the answer is no, it must be redesigned. Avoid sterile enterprise looks.
* **Visual Language**: The interface should feel calm, modern, editorial, and premium. Visual design should support content instead of competing with it. Every element must have a purpose.
* **Layout Structure**: Screens must follow: Header -> Hero Section -> Content Card -> Bottom Navigation. Avoid lists that start directly at the top of the viewport.
* **Typography Hierarchy**: Use weight, not size, to carry hierarchy on body copy (e.g. 20px body at weight 330 next to a 20px link at weight 480). Tighten line-heights on display sizes and keep it generous on body copy.
* **Illustration Placement**: Mandatory for onboarding slides, signup portals, empty states, and clear-data panels. Mascot styles must utilize transparent backgrounds, soft pastel colors, and hand-drawn outlines.
* **Density & touch targets**: Always choose more whitespace, less clutter, and large touch targets (minimum `44px`).
* **Empty State Rules**: Every empty state must display a warm illustration, a friendly human-centric headline (e.g. "Your box is empty", "Nothing pinned yet"), a descriptive block, and an action button.
* **Home Dashboard Layout**: Greeting header, pinned memory lists, recent screenshot thumbnails, and clear quick actions.
* **Settings Rules**: Keep setting views simple. No debug menus, technical tabs, or developer controls allowed on public user interfaces.
* **Prohibited Layout Styles**: Neumorphism, glassmorphism, default Material Design boxes, tiny icon lists, complex multi-level menus, and overloaded screens.

## Layout & Grid
* **Base unit**: 8px spacing system.
* **Whitespace Philosophy**: White space makes color blocks feel deliberate. Between every colored panel and the next, the page returns to white canvas with section breathing room. Inside a color block, give type generous side margins (often more than 1/4 of the block's width on each side).

## Elevation & Depth Matrix
* **Level 0 (flat)**: No shadow, no border. Used for color-block sections, footer, and hero views.
* **Level 1 (hairline)**: 1px `{colors.border-line}` border on `{colors.surface-white}`. Used for cards and input fields.
* **Level 2 (soft elevation)**: Drop shadow `0 8px 20px rgba(0, 0, 0, 0.08)`. Used for template tiles and dropdown menus.
* **Level 3 (modal)**: Strong shadow `0 12px 32px rgba(0, 0, 0, 0.12)`. Used for lightboxes and overlay dialogues.

## Shapes & Radii
* Image frames use `{rounded.md}` (8px).
* Template thumbnails on the home grid sit in `{rounded.md}` tiles with `{spacing.md}` interior padding.
* No avatar circles appear in marketing surfaces.
* Rounded corners should create consistency, not variety.

## Progressive Disclosure
Show only what users need right now. Reveal additional information only when it becomes relevant.

## Interaction & Feedback
Interactions should feel immediate, predictable, and forgiving.
* Undo over confirmation.
* Inline validation.
* Immediate feedback.
* Never block unnecessarily.
* Every action deserves a response. Success, failure, loading, warning, and empty states should clearly communicate what is happening.

## Copywriting Rules
* One idea per sentence.
* Avoid jargon.
* Be concise.
* Guide rather than impress.

## AI Design Guidelines
AI should never invent design decisions. It must follow existing tokens, components, spacing, typography, and motion rules to maintain consistency.
1. Existing Components
2. Existing Tokens
3. Existing Patterns
4. Simplicity

---

# Part 6: UI Component Registry

Always use these component structures. Duplicate component declarations are not allowed:

## Buttons
* **`button-primary`**: The black pill that appears in the top nav, every hero, and every closing CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 10px 20px, rounded `{rounded.pill}`.
* **`button-secondary`**: White pill with black text. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 18px 10px, rounded `{rounded.pill}`. No border.
* **`button-tertiary-text`**: Plain text link styled as a button hit target. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.link}`, rounded `{rounded.full}`, padding `{spacing.xs}` `{spacing.sm}`.
* **`button-icon-circular`**: 40px circular icon button used for carousels and social links. Background `{colors.surface-soft}`, text `{colors.ink}`, rounded `{rounded.full}`, size 40px.
* **`button-icon-circular-inverse`**: 40px circular icon button used on dark color blocks. Background `{colors.on-inverse-soft}` (translucent white), text `{colors.inverse-ink}`, rounded `{rounded.full}`, size 40px.
* **`button-danger`**: Coral background. Used for deletion and wiping data.
* **`button-magenta-promo`**: Saturated pink pill used only inside promotional surfaces. Background `{colors.accent-magenta}`, text `{colors.on-primary}`, type `{typography.button}`, rounded `{rounded.pill}`, padding 10px 18px.

## Pricing Tabs
* **`pricing-tab-default`**: `{colors.canvas}` background, `{colors.ink}` text, rounded `{rounded.pill}`.
* **`pricing-tab-selected`**: `{colors.primary}` background, `{colors.on-primary}` text.

## Cards
* **CollectionCard**: Staggered cover preview image, title, and screenshot count badge. Must not resemble standard file explorer folders.
* **ScreenshotCard**: Image preview thumbnail, saved timestamp, and optional bookmark pin marker.
* **PinnedMemoryCard**: Horizontal hero display container holding screenshot preview, description, and date.
* **`pricing-card`**: Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding `{spacing.lg}`. Stroked with `{colors.hairline}`.
* **`pricing-card-feature-row`**: Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`. Row separator is `{colors.hairline-soft}`.
* **`template-card`**: Thumbnail tile in the home grid. Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding `{spacing.md}`.
* **`feature-illustration-tile`**: Large illustration tile holding screenshots or mascot icons. Background `{colors.surface-soft}`, text `{colors.ink}`, type `{typography.eyebrow}`, rounded `{rounded.md}`, padding `{spacing.lg}`.

## Inputs
* **SearchInput**: Simple single-input text field for global query filters.
* **NoteInput**: Multiline sketchbook-style text input for attaching thoughts to memories.
* **`text-input`**: Basic input field with hairline borders and rounded corners. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 12px 14px. Focus is communicated via ring.

## Layout Containers
* **ScreenContainer**: Root layout wrapper providing margin pad, safe areas, and canvas background.
* **SectionHeader**: Category headers with a title and optional action links.
* **EmptyState**: Reusable wrapper mapping empty illustrations to description blocks and button actions.

## Color-Block Sections
* **`color-block-section`**: Background `{colors.block-lime}`, text `{colors.ink}`, type `{typography.subhead}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.
* **`color-block-section-lilac`**: Background `{colors.block-lilac}`.
* **`color-block-section-navy`**: Background `{colors.block-navy}`, text `{colors.inverse-ink}`.
* **`promo-banner-lilac`**: Background `{colors.block-lilac}`, text `{colors.ink}`, type `{typography.body-sm}`, rounded `{rounded.md}`, padding `{spacing.md}` `{spacing.lg}`. Carries a `button-magenta-promo` on the right edge.

## Navigation
* **BottomTabs**: Houses Home, Collections, Timeline, and Settings links.
* **FloatingAddButton (FAB)**: Central purple circle, fixed at the bottom, dedicated solely to importing screenshots.
* **`top-nav`**: Sticky white header bar holding logo, main links, and action buttons. Height 56px.
* **`marquee-strip`**: Thin customer logo scrolling strip. Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.body-sm}`, height 36px.
* **`comparison-checkmark`**: Green check used in the pricing comparison matrix. Background `{colors.canvas}`, glyph color `{colors.semantic-success}`, rounded `{rounded.full}`, size 16px.

## Illustration Inventory
* WelcomeIllustration: Onboarding 1
* OrganizeIllustration: Onboarding 2
* RememberIllustration: Onboarding 3
* AuthIllustration: Authentication
* EmptyBoxIllustration: Empty Home
* DeleteIllustration: Clear Data
* EmptyCollectionIllustration: Empty Collections
* EmptySearchIllustration: Search Empty State
* EmptyTimelineIllustration: Timeline Empty State

---

# Part 7: Responsive Behavior & Gutters

## Breakpoints Matrix
* **4k (1920px)**: Max content width holds at 1280px; gutters expand.
* **Desktop-XL (1440px)**: Default desktop layout.
* **Tablet (960px)**: Pricing collapses 4-up -> 2-up; nav bar collapses to a hamburger overlay.
* **Mobile-L (768px)**: Color-block sections become full-bleed (no rounded corners on viewport edges).
* **Mobile (560px)**: Display-xl reduces from 86px to ~48px; pill CTAs go full-width.

## Do's and Don'ts
* **DO**: Pair `button-primary` and `button-secondary` whenever a section needs both a primary action and a secondary action.
* **DO**: Allow the page to return to white canvas between every two color blocks so each block reads as deliberate.
* **DON'T**: Don't introduce mid-gray text. Body hierarchy comes from weight, not from opacity.
* **DON'T**: Don't add drop shadows to color-block sections. Saturated color is the depth device.
* **DON'T**: Don't combine more than one color block visible inside a single viewport.
* **DON'T**: Don't square off CTAs. Square buttons read as a different brand.
* **DON'T**: Don't put monospace fonts in body copy.
