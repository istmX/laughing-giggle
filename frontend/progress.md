## Backend LangGraph Phase

- **LangGraph Integration**: Implemented `context_engine.graph.js` and `playground.graph.js` using `@langchain/langgraph` and `@langchain/google-genai`.
- **Playground API Logic**: Hooked the Playground controller (`addMessage`) into the LangGraph state machine to process design feedback and compile HTML previews.
- **Upstash Redis Rate Limiting**: Added rate-limiting middleware for the playground endpoints to restrict queries.
## Frontend Phase Implementation

- **Firebase Auth Migration**: Replaced `gsi/client` with `firebase` SDK in `useGoogleAuth.js`.
- **Profile UI**: Implemented Profile generation using DiceBear API and Account deletion flow with backend integration.
## Backend Phase Implementation (Latest)

- **User Model Extended**: Added `pfpUrl`, `isVerified`, `loyaltyBadges`, `isAdmin` fields to User schema.
- **Firebase Auth Migration**: Replaced google-auth-library with firebase-admin SDK for Google login token verification. Google sign-in PFP is now saved to both `avatar` and `pfpUrl` fields.
- **Profile Feature**: New backend domain `src/features/profile/` with endpoints:
  - `GET /api/profile` — Fetch current user profile
  - `PUT /api/profile` — Update name/username with uniqueness validation
  - `PUT /api/profile/pfp` — Save a DiceBear or Google avatar URL to the user record
  - `DELETE /api/profile` — Cascade delete account, projects, and artifacts
- **Playground Feature**: New backend domain `src/features/playground/` with full session CRUD:
  - `POST /api/playground` — Create new design session
  - `GET /api/playground` — List all user sessions
  - `GET /api/playground/:sessionId` — Load session with full chat history
  - `PUT /api/playground/:sessionId/title` — Rename a session
  - `DELETE /api/playground/:sessionId` — Delete session
  - Session model stores: title, chatHistory, token state, and compiled previewHtml
- **LangGraph Graph Stubs**: Created `src/features/ai/graphs/` with placeholder files for `pm_wizard.graph.js`, `context_engine.graph.js`, and `playground.graph.js`. Ready for full implementation after `@langchain/langgraph` installation.

## Completed

- **AI Playground Frontend UI**:
  - Implemented the AI Playground frontend features in `src/features/playground`.
  - Added `api/playground.api.js` for API communications using `authFetch`.
  - Added `store/playground.store.js` utilizing Zustand for robust session state management.
  - Implemented `hooks/usePlayground.js` to manage UI hooks.
  - Built `ui/Playground.jsx` which hosts a split-pane layout with session sidebar, chat history interface, and HTML preview block.
  - Registered `/playground` in `AppRoutes.jsx` and updated the Dashboard Sidebar to link to it.

- **Artifacts Explorer & Panel Enhancements**:
  - **Color-Coded File System**: Redesigned both the inline file explorer cards and the sidebar [`ArtifactsPanel.jsx`](file:///workspaces/laughing-giggle/frontend/src/features/project/ui/components/ArtifactsPanel.jsx) to assign solid brand background colors based on path matching (lilac for agents, lime for UI/tokens, coral for tasks, pink for architecture/overviews) with high-contrast white text overlays.
  - **Dynamic Status Indicator**: Embedded a color-matching status dot inside cards in both panels that pulses for Ready states and pings during active generation loops.
  - **Backend DESIGN_SYSTEM Integration**: Copied [`DESIGN_SYSTEM.md`](file:///workspaces/laughing-giggle/frontend/DESIGN_SYSTEM.md) into the backend UI knowledge store ([`design_system.md`](file:///workspaces/laughing-giggle/backend/src/features/ai/data/ui/design_system.md)) and expanded backend prompt templates to digest layout, spacing, corner radius, and animation duration tokens.

- **Impeccable Chat Section Overhauls (Shape, Polish, Harden, Typeset)**:
  - **Unified Chat Layout**: Standardized on a single conversation scroll thread. Removed mode switching layout jumps; the initial empty state and follow-up questions are inline messages.
  - **Dedicated Spec-Ready Interstitial**: Replaced in-thread cream card specs with a full-panel overlay containing an optimized scrollable preview, progress details, and a clear action button ("Open workspace").
  - **Archived Options Cleanup**: Added option cleaning to strip actionable option chips from previous messages in store and hydration state when new inputs are submitted.
  - **Request Cancellation (Harden)**: Equipped the floating input with cancellation (AbortController) and turned the action button into a stop button (Square icon) during processing.
  - **Failed Message Recovery**: Stored failed inputs on error to display a retry bar beneath the text area.
  - **Typeset & Layout Limits**: Swapped layout properties and custom weights to standard `font-light` (300) and `font-normal` (400) options, raised timestamp text size to `text-[12px]`, and capped text area expansion to `max-h-[120px]` so inputs never obscure the conversation thread.

- **Major UI Polish Overhaul (⭐⭐⭐⭐⭐ Priority items 1–8 implemented)**:
  - **Removed dashboard feeling from ProjectWorkspace**: Conversation now occupies almost the full screen. The Artifacts panel slides in from the right as a separate layer — it no longer competes visually with the chat.
  - **Claude-style chat redesign**: No more chat bubbles. User messages are right-aligned floating plain text. AI messages are left-aligned with a small 24×24 rounded-square icon (violet→indigo gradient with a Sparkles icon inside). Generous `space-y-1` + `py-3/4` padding between messages. Thin `border-hairline/30` dividers between each message. Max-width `max-w-3xl mx-auto` for better readability.
  - **Animated AI icon**: A `<AiIcon>` component that gently rocks (`rotate: [0, 10, -10, 0]`) when the AI is generating. Uses a `from-violet-500 to-indigo-500` gradient instead of plain black circle.
  - **Floating pill input bar**: The input bar is now a `floating-input` absolutely positioned at the bottom of the chat area. Style: `rounded-[28px] bg-canvas border border-hairline` with `box-shadow: 0 4px 24px`. Focus state deepens the shadow and adds a subtle ring. Button is a black circle with `ArrowUp` icon.
  - **Artifact panel completely redesigned**: Replaced the buggy `<select>` dropdown with a proper file explorer. Each artifact is a `artifact-card` (file icon + name + status badge). Status badges: "Ready" = soft emerald (`bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]`), "Generating" = pulsing amber. The editor below morphs in with `opacity: 0→1, y: 6→0` animation when a file is clicked. Panel header shows "Context Files" + file count badge.
  - **Beautiful empty state**: `<EmptyState>` component with a gradient violet→indigo rounded-square icon, "Start describing your idea." headline, descriptive subtitle, and 2×2 suggestion card grid with hover lift effect (`whileHover: { y: -2 }`).
  - **Generation progress checklist**: `<GenerationProgress>` replaces the plain spinner. Shows staggered animated checklist items — done files get a green `<CheckCircle2>` + fade to 40% opacity, the active file gets a spinning loader + animated `…`, pending items show empty circles.
  - **AI Thinking dots**: `<AiThinking>` component — three dots animating `opacity: 1 → 0.3 → 1` with staggered delays (0ms, 200ms, 400ms). Replaces the blinking cursor block.
  - **Richer project header**: Now shows `← Projects / Title | [file count] · [time ago]` on the right side. Context toggle button shows artifact count badge.
  - **Semantic color accents**: 95% monochrome. Accent colors only on status badges. Violet/indigo on AI icon. Emerald for "Ready", amber for "Generating".
  - **Compact sidebar redesign**: Width reduced from 280px → 220px (collapsed: 56px). Section labels are `text-[10px] font-mono tracking-[0.12em] uppercase text-ink-muted/60`. Nav items use `rounded-lg` active state with `bg-surface-soft border border-hairline/80` (NOT full black). Spring animation `stiffness: 300 damping: 25`. Section label fade-in with x-offset on expand.
  - **Dashboard project cards redesign**: Cards use `rounded-xl border border-hairline bg-canvas hover:border-ink/20 hover:shadow-md`. Colored file icon square (32×32 rounded-md). Title in `font-[540]`, metadata in `font-mono text-[12px]`. Arrow appears on hover with `opacity-0 group-hover:opacity-100`.
  - **Dashboard empty state**: Gradient violet→indigo orb with Sparkles icon instead of generic folder. Better copy. Generous spacing.
  - **New sub-components created**:
    - `frontend/src/features/project/ui/components/AiIcon.jsx` — animated gradient AI icon
    - `frontend/src/features/project/ui/components/AiThinking.jsx` — three staggered animated dots
    - `frontend/src/features/project/ui/components/EmptyState.jsx` — beautiful workspace empty state
    - `frontend/src/features/project/ui/components/GenerationProgress.jsx` — animated generation checklist
  - **index.css workspace CSS layer**: Added `.notion-markdown` (Notion-like markdown with H1/H2/H3 hierarchy, colored code blocks, blockquote borders), `.floating-input`, `.artifact-card`, `.artifact-status-ready`, `.artifact-status-generating`, `.ai-icon-gradient`, `.ai-icon-thinking`, `.sidebar-nav-item`, `.chat-user-message`, `.chat-ai-message`, `.chat-divider`.



- **Artifact Generation Overhaul (Sequential Streaming)**:
  - Re-architected the artifact generation flow to solve LLM output token limits (which previously caused the AI to lazily mash all 11 files into a single summarized file).
  - The backend now instantly generates "Pending generation..." placeholders in the database for all 11 required files (AGENTS.md, TASKS.md, and all 9 context files) when the wizard completes.
  - Built a new single-artifact generation API endpoint (`POST /api/ai/artifacts/:projectId/generate`) that executes a highly-focused AI prompt providing ONLY the specific reference template for that exact file, guaranteeing maximum depth and quality.
  - Wired the React frontend (`ProjectWorkspace.jsx`) to sequentially loop through pending artifacts, ping the new backend endpoint, and live-update the UI state, allowing the user to watch the files populate one by one.
- **AI Orchestrator Resilience**:
  - Fixed a cascading timeout failure where fallback LLMs (Mistral, OpenRouter, Gemini) were being killed prematurely because they generate text slower than Groq (Llama 3.3).
  - Increased the hardcoded `TIMEOUT_MS` limit in `ai.orchestrator.js` from 25 seconds to 180 seconds to allow slower providers enough time to stream massive architecture documents.
- **Artifacts UI & File Switcher Polish**:
  - Replaced the buggy native `<select>` dropdown in the Artifacts sidebar with a custom, framer-motion animated menu to enforce strict `DESIGN.md` design tokens (`bg-canvas`, `text-ink`) and fix OS-level white-on-white text issues.
  - Fixed a missing property bug where artifacts rendered as empty strings in the dropdown by correctly mapping `activeArtifact.path` to the database schema's `activeArtifact.file_path`.
- **AI Agent Identity & Behavior Hardening**:
  - Injected strict AI identity rules into both the Developer and PM Wizard agents to ensure they unconditionally identify as "Zenix" created by developer "Istm" (and never leak upstream LLM provider names).
  - Fixed an infinite-loop bug in the PM Wizard (`conversational.prompt.js`) where the AI would aggressively repeat questions if the user typed a custom answer; the AI is now strictly instructed to unconditionally accept custom text and "Let Zenix decide" selections.
  - Upgraded the `artifacts.service.js` generation prompt to violently enforce the inclusion of strong product philosophies, hard UX rules, and strict operational directives, transforming the output from a generic spec sheet into a true "Agent Instruction Manual".
- **Real-Time Artifact Synchronization**:
  - Re-architected the Developer Chat (`developer.service.js`) to output a structured JSON payload combining conversational messages and an `updates` array for real-time file editing.
  - Fixed missing file updates by explicitly instructing the Developer Agent to always prepend the `context/` directory path to architecture files when pushing edits.
  - Wired the React frontend (`ProjectWorkspace.jsx`) to seamlessly intercept these real-time JSON payloads and instantly sync the live artifact edits into the text editor UI without a page reload.
- **Data Integrity**:
  - Updated the project cascade deletion transaction in `project.service.js` to automatically clean up all associated `Artifacts` records alongside `Ideas`, `Briefs`, and `AIGenerations`, ensuring zero orphaned files remain in the database when a project is wiped.
- **Developer Chat and Artifacts UI**:
  - Re-architected project flow to clearly separate the AI specification wizard (`NewProjectPage.jsx`) from the active developer workspace (`ProjectWorkspace.jsx`).
  - Added Zustand store (`useChatStore`) for managing real-time chat messages inside the developer workspace.
  - Implemented persistence for developer chat history by saving conversation turns to `wizard_state.devChatHistory` in the database.
  - Overhauled AI artifact generation logic in `artifacts.service.js` to dynamically scan the backend `data/context` directory and strictly require the AI to generate the full suite of context files (AGENTS.md, all context files, and TASKS.md) directly into the UI.
  - Improved AI artifact generation prompt to strictly enforce the output format based on project rules (e.g. `Agents.md`) rather than outputting generic task boards.
  - Implemented a draggable resize handle for the Artifacts sidebar, allowing users to dynamically adjust the width between 320px and 800px on desktop screens.
  - Upgraded the Artifacts text editor UI with elevated `bg-surface` styling, improved padding, subtle drop-shadows, and refined focus states for a premium code editor feel.
  - Implemented automatic redirection from the wizard to the developer chat once the brief is fully generated.
  - Updated conversational prompt logic to enforce asking at least 1-2 clarifying questions even for highly detailed prompts, preventing premature completion.
  - Built an interactive Artifacts sidebar inside `ProjectWorkspace.jsx` that automatically calls the backend generation endpoint, displays a shimmering loading state, and renders the generated files in a scrollable tab list.
  - Made artifacts editable in real-time with a debounced auto-save directly to the database.
  - Fully wired the "Download ZIP" button to export all generated architecture files directly to the user's browser.
  - Expanded the chat workspace's max width (`max-w-5xl`) for a better full-screen coding experience.
- **Dashboard & UI Modernization (Today's Updates)**:
  - [x] Refactored `DashboardShell` to use feature-based routing with nested `<Outlet>` navigation.
  - [x] Created `features/recent` and `features/favorites` directories with isolated API fetchers and UI components.
  - [x] Replaced mock data on the dashboard with live API calls.
  - [x] Implemented a cinematic full-page transition overlay with `AnimatePresence`.
  - [x] Overlay utilizes a perfectly centered (50% 50%) `clip-path` Iris Wipe reveal on every route change, powered by GSAP.
  - [x] Integrated GSAP's `SplitText` for the page transition text, animating individual characters from random offsets, rotations, and blurs into a cohesive title.
  - [x] Bound overlay background colors to `bg-ink` and text to `text-canvas` for maximum contrast and premium feel.
- **Project Cascade Deletion**:
  - Configured `deleteProject` in the backend project service to automatically clean up all associated database resources (linked `Ideas`, `Briefs`, `Tasks`, `Contexts`, and `AIGenerations` tables) in a single request transaction when deleting a project.
- **Developer Chat Sandbox and Message Scroller**:
  - Implemented the `MessageScroller` UI primitive featuring turn-anchoring, scroll-following, smooth scrolling, and prepending-preservation.
  - Set up a sandbox testing interface (`ProjectChatPage.jsx`) pre-filled with the AI-refined project specification, simulating live streaming responses when users send messages.
  - Configured `NewProjectPage.jsx` to completely replace the static "Brief Already Completed" placeholder screens and directly mount the interactive `ProjectChatPage` component once the wizard concludes.
  - Overhauled `QuestionCard.jsx` to support multi-select suggested options, avoid duplicate "Let Zenix decide" buttons, and add a quick-skip action button for filler wrap-up questions.
  - Refined backend prompt logic (`conversational.prompt.js`) with dynamic history-checking to strictly enforce the "Let Zenix decide" instruction. The AI is now explicitly fed a list of delegated topics and banned from looping over them.
  - Removed styling framework questions from the AI rules entirely, assuming Tailwind CSS (or NativeWind) by default to simplify the user flow.
  - Fixed an AI Orchestrator bug where `generateArtifacts` was missing from `getStrategy`, causing silent 500 errors.
  - Reduced the number of concurrently generated architecture files in `artifacts.service.js` from 11 to 4 (`AGENTS.md`, `project-overview.md`, `ui-tokens.md`, `TASKS.md`) to prevent the LLM from exceeding output token limits and crashing the JSON parser.
  - Disabled the chat input area in `ProjectWorkspace.jsx` when the project is marked complete, displaying a polished "Project Specification Finalized" notice instead to prevent user confusion.
- **Context Feature Folder Structure**:
  - Initialized `frontend/src/features/context/` directory with standardized subfolders (`api`, `hooks`, `store`, `ui`) and base files matching the project's architectural standards.
- **Project Context Asset Sync**:
  - Copied `AGENTS.md` (saved as `Agents.md`) and the entire `context/` folder from the `scribblebox/app` directory to the backend `src/features/ai/data` folder to support AI context engine features.
- **Landing page light-theme expansion**:
  - tightened the hero video takeover so the pinned stage hands off to the next section sooner, reducing the oversized dead space after the main video
  - replaced the landing’s heavier hardcoded visual treatments with shared light-theme landing classes in `index.css`
  - kept the landing fully in the light system, including the closing use-case section
  - added missing post-hero sections on `/`:
    - product flow / process section
    - generated outputs section
    - bento grid section
    - use-case / closing section
  - split the new landing work into dedicated feature files under `src/features/landing/`
  - added a reusable GSAP section-reveal hook so each landing section animates independently with reduced-motion fallback

- **Conversational questions options flow**:
  - Overhauled `QuestionCard.jsx` to render AI-suggested options, a "Let Zenix decide" choice, and a "Write my own answer" flow.
  - Added seamless transitions, custom inputs, focus-management, and a back-to-suggestions navigation trigger.
  - Forwarded options from `NewProjectPage.jsx` parsed conversation responses to the UI card.
  - Updated backend conversational prompt JSON schema to generate exactly 3 contextual, diverse suggestion options for the user.
  - Replaced hardcoded limits with a dynamic questioning flow where the AI continues asking questions until it gathers sufficient context.
  - Instructed the backend conversational prompt to immediately complete the specification if the user requests a bypass/skip, explicitly banned filler or generic questions (like "anything else to add?") without options, and enforced fallback options (such as "I have no other details, please generate the final spec") if a generic wrap-up question is asked.
  - Instructed the AI to ask about preferred technology stacks, color palettes, and typography early (by question 2, 3, or 4), and enforce a single concrete technology choice, color scheme, and font selection (defaulting to Next.js/Node/Express/Supabase/MongoDB, professional color psychology from `color_theory.md`, and top typography selections from `sans_serif_fonts.md` if undecided). Mapped features to user stories leveraging principles from `storytelling.md`, designed design token layouts following the primitive/semantic/component token structure in `product_design.md`, and detailed motion transitions using the glossary from `animations.md`.
  - Created `/backend/src/features/ai/data/ui/color_theory.md` containing 100 design-approved color combinations, `/backend/src/features/ai/data/ui/sans_serif_fonts.md` containing 25 standout sans-serif fonts, `/backend/src/features/ai/data/ui/storytelling.md` outlining UX storytelling guidelines, `/backend/src/features/ai/data/ui/product_design.md` detailing product design principles, and `/backend/src/features/ai/data/ui/animations.md` compiling motion vocabularies, as reference catalogs for the AI agent.
  - Re-targeted the output specification formatting specifically to serve as context for downstream AI coding agents (rather than human-facing summaries), and enabled immediate skipping of the questions flow if the initial prompt is already highly detailed.
  - Added a "Let Zenix decide all remaining questions" bypass button in `QuestionCard.jsx` starting at Question 10. When clicked, it signals the backend to finalize the specification using default architectural assumptions.
  - Updated the frontend step counter to display current question steps dynamically without hardcoded bounds, and enabled real-time state updates so that navigating away and reopening the project instantly displays both the initial prompt and completed specification correctly.
  - Enhanced the final summary screens (`Brief Complete` and `Brief Already Completed`) in `NewProjectPage.jsx` to display both the user's initial prompt and the final AI-refined project specification side by side.
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

Landing page work is active on the `/` route with the hero and first full set of supporting sections now wired in.

Latest hero pass:
- replaced the old document-card hero with a video-led Zenix hero that matches the new reference direction more closely
- added an inline autoplay video chip inside the headline using the same source as the main hero film
- introduced GSAP `ScrollTrigger` expansion so the rounded hero video stage pins and grows toward a full-viewport takeover on desktop scroll
- kept reduced-motion users on a static version without scroll choreography
- `$impeccable polish`: wired hero CTAs to `/login` and `/signup`, switched harsh black CTAs to the brand indigo treatment, removed video play overlays, increased the resting video radius, and lengthened the pinned scroll takeover with Lenis smoothing
- `$impeccable polish` follow-up: deepened the background glow field, added more far-field cubes and lower-section hints, and delayed the headline fade so the scroll takeover feels less abrupt
- `$impeccable polish` follow-up 2: removed the fake control bar from the big video so the stage reads as a clean film surface
- Added global Lenis smooth scrolling at the app shell and removed the duplicate Lenis instance from the hero hook.
- Added the first post-hero comparison section with GSAP scroll reveal, Zenix context engine center node, and generated-output list.
- `$impeccable polish` latest:
  - shortened the GSAP pinned hero scroll distance so the large video no longer leaves as much empty follow-through before the next section
  - converted the landing into a multi-section light-theme story with token-backed surfaces and softer section transitions
  - added dedicated landing feature components plus section-scoped GSAP reveal motion

The home page now includes:
- the original `hero-03.jsx` hero structure with video-led GSAP motion
- GSAP plugin setup plus Lenis smooth scrolling with reduced-motion fallback
- a comparison section explaining the before/after Zenix workflow
- a process / product flow section
- a generated outputs section
- a bento grid section
- a closing use-case section

## Pending

- **Landing page foundation**
  - review the new section pacing in-browser and tune spacing if any transitions still feel loose
  - decide whether the comparison section should stay as the first post-hero block or if another narrative order reads better visually

- **Hero rebuild**
  - verify the shortened hero pin feels right on long desktop scroll sessions
  - fine-tune the hero typography and CTA interactions after visual review

- **Brand storytelling sections**
  - decide whether to reintroduce richer branded visuals or generated imagery for the landing sections
  - make the generated outputs and bento section feel even closer to the intended final marketing composition if a tighter reference is provided

- **Animation system requirements**
  - continue aligning section motion with `Animations.md`, especially if more bespoke reveals are added after review
  - extend reduced-motion handling to any future decorative motion added to the landing

- **Dependency gap**
  - resolved: `split-type` installed for split text animation
  - resolved: `ogl` installed for the React Bits `LineWaves` component
  - no additional package is currently required for `gsap`, `@gsap/react`, `ScrollTrigger`, or `lenis` because they are already present

- **Verification**
  - review the landing page in-browser on desktop and mobile breakpoints with the new sections in place
  - confirm the hero handoff now feels tighter after the video stage
  - lint is currently blocked by unrelated existing issues in `Sidebar.jsx`, `text-shimmer-wave.jsx`, `NewProjectPage.jsx`, `PromptInput.jsx`, and `QuestionCard.jsx`

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
- **Dashboard Background Polish**: Added a subtle radial-gradient dot pattern (`.dashboard-bg`) that dynamically adapts to all themes (Light, Dark, Midnight, Emerald) using `color-mix`.
- **Favorites & Recent Projects**: Added `is_favorite` and `last_opened_at` to the `Project` schema. Refactored `Overview.jsx` to group projects into "Favorites" and "Recent" sections, sorted by last opened date. Implemented an interactive favorite toggle.

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



- **Project Creation UI built**:
  - Added `EmptyProjects.jsx` with a minimal, premium empty state
  - Added `CreateProjectDialog.jsx` with an auto-resizing, hero-style textarea, example prompt buttons, and polished focus states
  - Added `ProjectCard.jsx` for reusable project display
  - Integrated the empty state and dialog into `Dashboard/components/Overview.jsx`
  - Used exact typography and border-radius tokens from `DESIGN.md` (no hardcoded CSS values)
  - Focused strictly on UI components, without backend logic

- **Project AI API Integration**:
  - Wired up `POST /ideas` API to save the user's raw prompt and generate an idea ID.
  - Connected `POST /ai/analyze/:ideaId` API to generate an intelligent project title and description via the AI orchestrator.
  - Automatically synced AI analysis results to the Project object using the `PATCH /projects/:projectId` endpoint.
  - Updated `PromptInput.jsx` UI with loading states and `react-hot-toast` notifications to handle the multi-step async flow seamlessly.
  - Wired up `POST /ai/questions/:ideaId` API to generate dynamic, intelligent clarification questions based on the user's specific idea prompt.
  - Implemented a backend refinement flow with a new `POST /ai/refine/:ideaId` API to synthesize original prompts and clarification answers into a final, powerful **Refined Project Specification**.
  - Updated the Dummy "Brief Complete" screen to display the highly-detailed AI-generated Refined Project Specification instead of raw answers.
  - Added robust caching prevention (`cache: 'no-cache'`) to `authFetch` to fix a stale state bug where users would mistakenly see the prompt input again after navigating back to a completed project.
  - Enforced a strict "one idea per project" lock in the UI by fetching the project state on mount and checking if the idea has already been submitted and skipping the prompt wizard entirely if so.
- **Dashboard Polish & Flexbox Layout Stabilization**:
  - Permanently fixed the CSS `-webkit-box` line-clamp bug across all project cards (`ProjectCard`, `ProjectRow`, `FeaturedProject`) by correctly combining `min-w-0`, block-level `w-full` wrappers, and `truncate`.
  - Stopped text from aggressively breaking into 1 character per line in narrow flex columns.
  - Re-anchored `line-clamp-2` inside a block-level wrapper so it calculates width correctly inside flex containers, preventing description truncation at 3-4 letters.
  - Fixed the Editor workspace header so long project titles gracefully truncate with ellipses instead of blowing out the top navigation layout.

- **Animated Flow Polish (Framer Motion)**:
  - Added origin-aware FLIP expansion animation for the "New Project" modal from its trigger button using `layoutId`.
  - Added a staggered document reveal in the Artifacts sidebar during generation.
  - Injected an inline background loading message in the chat workspace while Zenix maps architecture.
  - Added upward-fading animations to the Interview AI questions.
  - Added staggered deal-in animations for project cards when navigating back to the dashboard.
- **Framer Motion UX Polish (Dashboard & Chat)**:
  - Fixed a critical UX blocking bug in `ProjectWorkspace.jsx` where the entire page load was halted while waiting for background AI artifacts to generate. Re-architected this to resolve instantly and generate artifacts asynchronously, unblocking the Chat UI instantly.
  - Fixed the context-loss bug when users submitted new projects via the Dashboard modal by passing a `wizard_state: { autoStart: true, prompt }` payload, which `NewProjectPage` now intercepts to seamlessly bypass the redundant step 0 text box and begin AI processing automatically.
  - Corrected a JSX syntax error `</motion.div>` in `QuestionCard.jsx` caused by the previous polish pass.

