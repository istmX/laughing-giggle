## Completed

- **Auth pages redesigned** into a centered split-screen layout that matches the login reference more closely:
  - dark editorial left panel with centered hero copy
  - bordered right-side card with centered form heading
  - mobile brand header so the shell still reads well on small screens
- **Shared auth field component added** for login and signup:
  - typing pulse animation on `onChange`
  - password visibility toggle
  - consistent icon + label layout
- **Shared social auth section added** for the Google sign-in row and divider
- **Login and signup forms cleaned up**:
  - removed the legacy decorative AnimatedForm block
  - kept auth logic intact
  - navigation now only happens after a successful auth response
- **Password toggle logic fixed** so the eye icon now actually reveals and hides the password value
- **Landing page hero corrected** so the live `/` route uses the original `hero-03.jsx` structure again:
  - added `split-type` powered GSAP character reveal to the existing hero text
  - kept the original headline structure, side copy, metadata row, media strip, and vertical "Context First" marker
  - replaced the heavy `@aliimam/icons` hero imports with a lightweight local mark and Phosphor social icons
- **React Bits components integrated** for the landing page:
  - `LineWaves` added to the hero, assembly visual, and closing CTA
  - `BorderGlow` added to the horizontal document panels and assembly output panel
  - `CardSwap` added to the generated context section
  - `DecayCard` added as a generated artifact visual
- **Landing page critique fixes started**:
  - reduced repeated boxed-card grammar in the marquee, story flow, generated context, workflow, and CTA sections
  - added a desktop-only pinned horizontal scroll behavior with stacked fallback on smaller screens
  - replaced AI tool initials with icon-based monochrome marks

## Current status

Auth forms now use a shared dark shell, centered heading treatment, and input-level motion that matches the reference more closely.

Landing page work is now underway on the `/` route.

Latest hero pass:
- replaced the old document-card hero with a video-led Zenix hero that matches the new reference direction more closely
- added an inline autoplay video chip inside the headline using the same source as the main hero film
- introduced GSAP `ScrollTrigger` expansion so the rounded hero video stage pins and grows toward a full-viewport takeover on desktop scroll
- kept reduced-motion users on a static version without scroll choreography
- `$impeccable polish`: wired hero CTAs to `/login` and `/signup`, switched harsh black CTAs to the brand indigo treatment, removed video play overlays, increased the resting video radius, and lengthened the pinned scroll takeover with Lenis smoothing
- `$impeccable polish` follow-up: deepened the background glow field, added more far-field cubes and lower-section hints, and delayed the headline fade so the scroll takeover feels less abrupt
- `$impeccable polish` follow-up 2: removed the fake control bar from the big video so the stage reads as a clean film surface

The home page now includes:
- the original `hero-03.jsx` hero structure with split text animation
- GSAP plugin setup plus Lenis smooth scrolling with reduced-motion fallback
- a `LineWaves` ambient hero background
- an AI agent marquee section
- a storytelling flow section
- a desktop pinned horizontal document showcase powered by `ScrollTrigger`
- a generated-context section using `CardSwap` and `DecayCard`
- a context assembly / workflow section using `LineWaves` and `BorderGlow`
- a closing CTA band

## Pending

- **Landing page foundation**
  - refine section spacing, pacing, and visual transitions after the first full-page pass
  - continue reducing repeated section grammar where a React Bits visual can carry the moment better

- **Hero rebuild**
  - polish the restored hero typography so it lands even closer to the provided reference image
  - add richer CTA interaction details such as magnetic hover if it improves feel without becoming gimmicky
  - tune the `LineWaves` background so it supports the hero without overpowering the text

- **Brand storytelling sections**
  - replace the current icon-based AI tool marks with official monochrome SVG logos if exact brand SVGs are provided or approved
  - make the story and assembly sections feel more bespoke with stronger line animation and relationship cues
  - push the generated context section further now that `CardSwap` and `DecayCard` are in place

- **Horizontal document experience**
  - tune the pinned horizontal section for longer scroll sessions
  - add more refined panel-specific motion and visual detail inside each document panel

- **Animation system requirements**
  - continue aligning section motion with `Animations.md`, especially reveal, stagger, orchestration, and scroll-driven pacing
  - extend reduced-motion handling to any new ambient effects added in later passes

- **Dependency gap**
  - resolved: `split-type` installed for split text animation
  - resolved: `ogl` installed for the React Bits `LineWaves` component
  - no additional package is currently required for `gsap`, `@gsap/react`, `ScrollTrigger`, or `lenis` because they are already present

- **Verification**
  - review the landing page in-browser on desktop and mobile breakpoints with the restored hero
  - verify pinned horizontal scrolling behaves well on desktop and falls back cleanly on smaller screens
  - confirm marquee, hero reveals, and smooth scrolling stay performant
  - lint is currently blocked by an unrelated unused `React` import in `frontend/src/Dashboard/Dashboard.jsx`

## Next tasks

- visually review the restored hero and React Bits sections in-browser
- replace icon-based tool marks with exact official SVG logos if desired
- fix or approve the unrelated `Dashboard.jsx` lint issue so `npm run lint` can pass fully
- build the initial dashboard shell structure

## Dashboard implementation

### Completed
- **Created a collapsible dashboard shell**
  - Integrated `lucide-react` for familiar product iconography
  - Built a collapsible desktop sidebar using `framer-motion` for smooth width transitions
  - Implemented a mobile-responsive off-canvas drawer for navigation
  - Added a top navigation bar with breadcrumbs and utility icons
  - Styled with the project's design tokens (e.g. `bg-background`, `border-hairline`, `text-ink`)
  - Configured Codex with 21st MCP server via `~/.codex/config.toml`

### Next
- Expand the dashboard with more specific product routes and data views
- Verify responsive edge cases in the dashboard view

### Active
- `$impeccable theme`: Built a multi-theme architecture for the Dashboard (Light, Dark, Midnight, Emerald) with Zustand persistence.
- Added strict route-checking so public marketing/auth pages remain Light mode, while Dashboard fully respects the user's selected theme.
- Globally audited and purged hardcoded colors (`bg-white`, `text-white`, `#ff3d8b`, etc.) across all Dashboard components to ensure perfect semantic scaling.
- Added global Toast notifications for auth flows and a reusable Loader component.
- Built a custom 404 Not Found page.
- Created the Profile Page with avatar randomization via DiceBear API and user data fetching.
- `$impeccable layout`: Fixed dashboard scrolling (used `h-dvh` instead of `h-screen` for mobile Safari compatibility).
- Hid scrollbars across the dashboard sidebar and main content areas to reduce visual clutter.
- `$impeccable onboard`: Overhauled dashboard empty state with a clear "No projects yet" message, larger icon treatment, and a primary CTA to create a project.
- `$impeccable extract`: Broke monolithic `Dashboard.jsx` into modular `Sidebar`, `Header`, and `Overview` components in `frontend/src/Dashboard/components/`.
- `$impeccable distill`: Stripped out generic "AI template" placeholder metrics from the dashboard overview to focus purely on the empty state and core actions.
- `$impeccable harden`: Hooked up the top header to dynamically display the active route via `useLocation`, and removed non-functional notification/search icons to eliminate dead UI.
- `$impeccable delight`: Added subtle Framer Motion entry animations, interactive hover states (like the rotating plus icon), and warmer border/glow styling to make the empty state feel premium and inviting.
- `$impeccable polish`: Performed a final quality pass to ensure components are clean, spacing is mathematically consistent, mobile/desktop states align, and there are no stray console logs or layout regressions.
- **Dashboard Empty State Polish**: Applied Figma design system (`DESIGN.md`) colors and typography, leaving only a magenta folder icon and CTA button with spring physics (`Animations.md`) for a minimalist, delightful experience.
- **Logout API Flow**: Wired up the `POST /auth/logout` API, documented it in `apidocs.md`, securely blacklisted the JWT token on the backend, and properly cleared `sessionStorage` and the `useAuth` store on the frontend.

---

## Design system token migration

### Completed

- **`index.css` redesigned** with the full Figma DESIGN.md token set:
  - Added typography tokens: `--font-size-*` with paired line-heights for display-xl, display-lg, headline, subhead, card-title, body-lg, body, body-sm, link, button, eyebrow, caption
  - Added tracking tokens: `--tracking-*` for every type role matching the exact letter-spacing values from DESIGN.md
  - Added font-weight tokens: `--font-weight-320/330/340/480/540/700` matching the figmaSans variable axis
  - Added spacing tokens: `--spacing-*` for hair/xxs/xs/sm/md/lg/xl/xxl/section
  - Updated border-radius tokens to match DESIGN.md: `--radius-xs: 2px`, `--radius-sm: 6px`, `--radius-md: 8px`, `--radius-lg: 24px`, `--radius-xl: 32px`, `--radius-2xl: 50px (pill)`, `--radius-4xl: 9999px (full)`
  - Cleaned up self-referential and redundant `@theme inline` variables
  - Removed unused `--font-serif` and duplicate font-family declarations from `:root`
  - Added `--radius-pill` and `--radius-full` semantics via `--radius-2xl`/`--radius-4xl`
  - All tokens are available as Tailwind utilities: `text-display-xl`, `tracking-eyebrow`, `rounded-lg`, `font-340`, etc.

- **All custom components updated** to use design tokens instead of hardcoded values:
  - `hero-03.jsx`: replaced all `tracking-[0.34em]`/`tracking-[0.24em]`/`tracking-[0.22em]` with `tracking-caption`/`tracking-eyebrow`; replaced `rounded-[28px]`/`rounded-[32px]` with `rounded-xl`; replaced `rounded-[24px]` with `rounded-lg`; replaced `text-[0.7rem]`/`text-[1.05rem]`/`text-[1.65rem]` with `text-caption`/`text-body-lg`/`text-headline`
  - `AuthShell.jsx`: replaced `rounded-[24px]`/`rounded-[18px]`/`rounded-[28px]` with `rounded-lg`/`rounded-xl`; replaced `text-[1.05rem]`/`text-[0.7rem]`/`text-[1.7rem]` with `text-body-lg`/`text-caption`/`text-3xl`; replaced tracking values with tokens
  - `AuthField.jsx`: replaced `rounded-[16px]` with `rounded-md`; replaced `text-[15px]`/`text-[0.95rem]` with `text-body-sm`
  - `AuthSocialSection.jsx`: replaced `rounded-[18px]` with `rounded-lg`; replaced `text-[15px]`/`text-[0.95rem]` with `text-body-sm`
  - `Login.jsx`/`Signup.jsx`: replaced `rounded-[18px]`/`rounded-[16px]` with `rounded-lg`; replaced `text-[15px]`/`text-[0.95rem]` with `text-body-sm`
  - `Dashboard.jsx`: replaced `rounded-[2rem]` with `rounded-xl`; replaced `rounded-[1.5rem]` with `rounded-lg`; replaced `tracking-[-0.05em]` with `tracking-display-lg`
  - `Dashboard/Dashboard.jsx`: replaced `rounded-[1.5rem]` with `rounded-lg`; replaced `tracking-[-0.05em]` with `tracking-display-lg`
  - `perspective-grid.jsx`: replaced `duration-[1500ms]` with `duration-1000`
  - `reactbits/*.css`: replaced hardcoded border-radius, border, and background colors with CSS variables (`var(--radius-lg)`, `var(--hairline)`, `var(--surface-dark)`, `var(--surface-dark-foreground)`, `var(--tracking-body-lg)`, `var(--spacing-lg)`)



