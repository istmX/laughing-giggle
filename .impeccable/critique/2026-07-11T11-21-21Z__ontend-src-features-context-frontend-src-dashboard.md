---
target: chat and context and frontend
total_score: 19
p0_count: 1
p1_count: 2
timestamp: 2026-07-11T11-21-21Z
slug: ontend-src-features-context-frontend-src-dashboard
---
# Zenix Critique — Chat, Context & Frontend

Method: dual-agent (A: c22368d2 · B: f30e23a3)

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Wizard has no total-step indicator; context generation fakes progress on a fixed 3.5s timer |
| 2 | Match System / Real World | 3 | Mostly clear language; "AI Spec Engine Active" is jargon with no actionable meaning |
| 3 | User Control and Freedom | 1 | Wizard is a one-way funnel: no back, no undo, no restart. Delete is instant with no undo toast. |
| 4 | Consistency and Standards | 2 | Four different primary-button radii. Mixed `bg-background` / `bg-canvas` for same role. `text-sm` and `text-body-sm` both used for same scale position. |
| 5 | Error Prevention | 2 | Delete modal exists but prompt accepts 1-char input. No guard against sending entire spec as chat msg. |
| 6 | Recognition Rather Than Recall | 3 | Good option surfacing in wizard. No breadcrumbs. Previous wizard answers invisible. |
| 7 | Flexibility and Efficiency | 1 | Zero keyboard shortcuts. No Cmd+K. No search/filter/sort on projects. "Decide all" shortcut appears at Q10, not Q3. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean token system. Sidebar has 14 items for 2 real routes. Duplicated completion templates. |
| 9 | Error Recovery | 1 | Wizard failure drops user to step 0 silently. Chat streaming has no error path. Toasts disappear. |
| 10 | Help and Documentation | 1 | Zero contextual help. No tooltips. No onboarding. "Documentation" sidebar link is a dead end. |
| **Total** | | **19/40** | **Poor — major UX overhaul needed in control, efficiency, and error recovery** |

---

## Anti-Patterns Verdict

### LLM Assessment

**Moderate AI slop (4/10).** Passes on first glance but a designer spots the template bones within 30 seconds:

- **Generic card grid**: Overview.jsx L97 — standard `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with identical icon→title→description→date cards. Zero project-state differentiation.
- **Ghost-card pattern**: Overview.jsx L105 (`border border-hairline` + `hover:shadow-sm`), NewProjectPage.jsx L307 (`border border-hairline` + `shadow-sm`), ContextPanel.jsx L56 (same).
- **Eyebrow everywhere**: Four surfaces use tiny uppercase tracked text above sections — PromptInput L34, Sidebar L65, ContextPanel L81, Overview L140. It's reflex, not voice.
- **Generic completion card**: NewProjectPage lines 307-342 and 361-387 are the textbook "checkmark → heading → paragraph → CTA" template, duplicated near-verbatim.

Clean on: gradient text, side-stripe borders, decorative grids, stripe backgrounds, numbered markers, glassmorphism-as-default.

### Deterministic Scan

CLI detector returned **0 findings** because the codebase routes all values through Tailwind v4 design tokens. No literal `border-left: 3px solid`, no `text-purple-*`, no `bg-clip-text`. The detector is effectively blind to this codebase's issues.

### Manual Detector Review

Assessment B found **35 issues** the automated scan missed:
- **5 High**: Missing `role="dialog"` on Modal, no focus trap, clickable `<div>` card without keyboard access, icon-only buttons without aria-labels
- **14 Medium**: Missing aria-labels on textareas/links, missing focus rings on all interactive option buttons, inconsistent component vocabulary
- **10 Low**: Hardcoded `text-white`, oversized modal, minor spacing inconsistencies
- **6 Advisory**: Arbitrary type sizes, ghost-card patterns

---

## Overall Impression

Zenix has **strong infrastructure** (design token system, MessageScroller architecture, semantic color naming) but the product surfaces built on top of that infrastructure are **unfinished and unpolished**. The wizard flow — the core product experience — has no progress visibility, no retreat path, and dumps users into a fake chat sandbox at the end. The dashboard sidebar promises 14 features when 2 exist. The accessibility story is weak across every surface. The bones are good; the body needs significant work.

**Single biggest opportunity**: Unify the wizard and chat into a single conversational interface. The current 3-surface architecture (Prompt → Questions → Chat) is three UIs for what should be one.

---

## What's Working

1. **Disciplined design token system** — `index.css` defines thorough semantic tokens (ink, canvas, hairline, surface-soft, surface-elevated), paired type sizes with line-heights, multi-theme support (dark, midnight, emerald). Token naming is readable and avoids abstract gray-400 vocabulary. This is genuinely thoughtful infrastructure.

2. **MessageScroller compound component** — `message-scroller.jsx` is a well-engineered primitive with proper IntersectionObserver visibility tracking, scroll anchoring, auto-follow, prepend-preservation, and accessibility attributes (`role="log"`, `aria-relevant="additions"`). The `content-visibility-auto` optimization shows performance awareness.

3. **QuestionCard interaction model** — Multi-select options with visual indicators, auto-submit for special options ("Let Zenix decide"), toggle between suggestions and custom input with a back button. The interaction design is smart even though the visual execution has consistency issues.

---

## Priority Issues

### [P0] Wizard has no progress visibility — users don't know how long this takes
- **Why it matters**: "Question 7" with no ceiling creates open-ended anxiety. Users don't know if there are 5 questions or 50. This is the single worst UX moment in the product — the point where users abandon.
- **Files**: ProgressIndicator.jsx (renders `Question ${current}` with undefined `total`), NewProjectPage.jsx (never passes `totalSteps`)
- **Fix**: Show "Question 7 · Usually ~8-12 questions" as a soft expectation, or a horizontal progress bar that fills proportionally. Move the "Let Zenix decide all remaining" shortcut from question 10 to question 3.
- **Suggested command**: `$impeccable harden` (add progress, guard states)

### [P1] Wizard is a one-way funnel with no retreat or review
- **Why it matters**: Developers iterate. A spec tool that locks answers permanently conflicts with the target user's mental model. Can't go back, can't review answers, can't restart. Once complete, "Brief Already Completed" with no reset.
- **Files**: NewProjectPage.jsx L309 (no reset), L213-256 (forward-only), QuestionCard.jsx (no history display)
- **Fix**: Add a collapsible sidebar/accordion of previous Q&A during the flow. Add "Start Over" on completed state. Allow clicking the progress indicator to revisit answers.
- **Suggested command**: `$impeccable shape` (rethink the wizard flow before rebuilding)

### [P1] Modal lacks focus trap, role, and aria-modal — keyboard users are trapped outside
- **Why it matters**: Tab key escapes the modal overlay. Screen readers don't know a dialog is open. The delete confirmation — a destructive action — is inaccessible to keyboard-only users.
- **Files**: Modal.jsx (no `role="dialog"`, no `aria-modal="true"`, no focus trap implementation)
- **Fix**: Add `role="dialog"` + `aria-modal="true"`. Implement focus trap (on mount, focus first focusable; on Tab at last element, cycle to first). Consider `<dialog>` element.
- **Suggested command**: `$impeccable audit` (accessibility pass)

### [P2] Chat page is a non-functional simulation with hardcoded fake responses
- **Why it matters**: Users arrive here after significant wizard effort. The "AI Spec Engine Active" green dot + "Zenix Architect" persona + identical responses regardless of input creates a credibility gap that's hard to recover from. The trust signals are louder than the actual capability.
- **Files**: ProjectChatPage.jsx L86-122 (hardcoded `fullReply` string)
- **Fix**: Either connect to a real LLM backend, remove the chat surface and replace with a "next steps" page, or label it prominently as "Demo Mode" with a visible badge instead of a fake active-status dot.
- **Suggested command**: `$impeccable harden` (honest states)

### [P2] Sidebar promises 14 features when 2 exist
- **Files**: Sidebar.jsx L14-52 (14 nav items across 5 groups; "AI Playground", "Context Library", "Templates", "Recent", "Favorites", "Docs", "Changelog" are all likely dead-end routes)
- **Why it matters**: Every dead-end link is a broken promise. A first-time user clicking "Templates" and hitting nothing erodes trust immediately.
- **Fix**: Strip to built routes only: "All Projects" + "Account" + "Sign out". Add items only when routes exist.
- **Suggested command**: `$impeccable distill` (strip to what's real)

---

## Persona Red Flags

### Alex (Power User) — Dashboard, Wizard, Chat

- **No `Cmd+K` palette, no `Cmd+N` shortcut.** Must click through sidebar to create a project.
- **Cannot skip wizard questions with keyboard.** Enter submits but option buttons have no visible focus rings — keyboard selection is invisible.
- **Project grid has no sort, filter, or search.** With 20+ projects the grid is unusable. No list view toggle.
- **"Decide all remaining" appears at question 10**, not question 3. Power users must click through 10 questions before getting the escape hatch.
- **Chat has no `Cmd+Enter` to send, no message copy, no search.**

### Jordan (First-Timer) — Empty state, Wizard

- **EmptyProjects.jsx**: "No projects yet" with one button. No explanation of what a "project" contains, no sample project to explore. The 200px-tall empty textarea with "I want to build..." is intimidating for someone without a fully-formed idea.
- **"Question 3" with no total** — Jordan doesn't know if this takes 2 minutes or 20 minutes. Will abandon.
- **Post-wizard**: Lands on "Open Developer Chat Sandbox" — Jordan doesn't know what a sandbox is. Clicks in, sends a message, gets a fake response. Confusion.
- **Sidebar**: 14 items. Clicks "Templates" — dead end. Clicks "AI Playground" — dead end. Trust erodes fast.

### Sam (Accessibility-Dependent) — All surfaces

- **Option buttons lack `aria-pressed` or `aria-selected`** — screen reader won't announce selection state. Visual-only checkmark indicators convey no semantic information.
- **Project card is a clickable `<div>` with no `role="button"`, `tabIndex`, or keyboard handler** — completely inaccessible.
- **Modal has no focus trap** — Tab key moves focus behind the overlay.
- **`text-ink-faint` placeholder fails WCAG AA** — `rgb(0 0 0 / 0.34)` on `oklch(0.99 0 0)` ≈ 2.7:1 contrast ratio (needs 4.5:1).
- **`text-[10px]` used in 3 files** — below readable threshold for many users, below the type scale minimum (caption = 12px).
- **Icon-only send button and back link** have no `aria-label`.

---

## Minor Observations

1. **Hardcoded fallback title** — ProjectChatPage.jsx L147: `'Dating Site for Developers'`. Dev leftover that will ship to production.
2. **Duplicated completion template** — NewProjectPage.jsx L307-342 and L361-387 are near-identical. Should be one `<CompletedState>` component.
3. **Fake progress is dishonest** — ContextPanel.jsx L22-28: 6 progress steps on a fixed 3500ms timer, unrelated to actual backend progress. Worse than an honest spinner.
4. **Hidden scrollbars everywhere** — Sidebar and Overview hide scrollbar affordance. Users with many projects won't know the grid scrolls.
5. **No loading skeletons** — Overview and ChatPage show centered spinners. Jarring layout shift when content appears.
6. **Message body in secondary color** — ChatPage L190: primary message content uses `text-ink-muted` at `text-body-sm`. The most important content is rendered in the secondary color at a smaller size.
7. **Logout has no confirmation** — Sidebar L220: `logout()` fires directly on click. Accidental click = instant logout.
8. **`bg-emerald-500`** — ProjectChatPage L152: raw Tailwind palette color bypassing the token system. Should be a `bg-success` token.

---

## Questions to Consider

1. **Why does the wizard exist separately from the chat?** The wizard collects answers → produces a spec → sends users to a chat. What if the wizard *was* the chat? A conversational interface from step 0 that asks questions inline, shows the evolving spec, and lets users edit it directly.

2. **What happens when someone has 50 projects?** No search, sort, filter, or pagination. Is this a single-project tool pretending to be a multi-project workspace?

3. **Who is "Zenix Architect" and why should I trust it?** The green pulsing dot says "active" but the responses are hardcoded. Trust signals louder than capability creates a credibility gap.

4. **Is the sidebar an information architecture or a wish list?** Five groups, 14 items, for a product that does: create project → answer questions → view spec. Ship the sidebar you have, not the one you want.

5. **Why can't I go back?** The wizard is irreversible. This is a spec tool for developers — people who iterate, revise, and change their minds. The irreversibility conflicts with the target user's fundamental behavior.
