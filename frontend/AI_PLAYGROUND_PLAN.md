# AI Playground redesign plan

## Goal

Turn the AI Playground into a live design-system workspace. A user should be able to describe a design change, watch the design tokens update in real time, and immediately see those changes reflected in the preview, token inspector, and generated artifacts.

The experience should feel like one connected loop:

`prompt → AI interpretation → token patch → live preview → inspect/export`

## Current baseline

- Sessions, titles, chat history, and saved `tokens` already exist.
- The frontend currently sends one `POST /playground/:sessionId/message` request and waits for the complete response.
- The backend calls the Python playground orchestrator, then saves the final assistant message and token object.
- `LiveSandbox` already consumes colors, typography, radius, and theme tokens.
- The current preview is a static demo surface and does not yet expose the design system as inspectable sections.
- There is no streaming or event channel today, so “real time” needs an explicit transport and event contract.

## Session lifecycle and empty-chat behavior

Treat a newly opened playground chat as a local draft until the user submits a real message. Selecting “New chat”, opening the Playground entry page, or switching away from an empty chat must not create a database session, call the message API, or add an empty item to the session rail.

### Required states

Use an explicit client-side session state:

```text
draft   → no persisted session exists and no user message has been submitted
active  → a persisted session exists and contains at least one user message
loading → the first message is being submitted and the session is being created
failed  → the first submission failed; the draft remains retryable
```

### Creation rules

- “New chat” resets the composer, messages, generation state, and local token draft, then returns to `draft`.
- Whitespace-only input is treated as empty and must not create a session.
- The first non-empty user message is the creation trigger.
- Prefer a dedicated `POST /playground` request that accepts the first message and returns the persisted `sessionId`; if the backend cannot support that yet, create the session immediately before the first message request and never earlier.
- Do not create a session from a page mount, route visit, empty composer, starter-prompt render, session-rail selection, or browser refresh.
- Disable duplicate first-message submissions while the session is in `loading`.
- If first-message creation or generation fails, keep the user’s message in the local draft, show a retry action, and allow retry without silently creating another session.
- Add the newly persisted session to the rail only after the server returns a valid `sessionId`.
- Generate the default title from the first meaningful user message only after persistence succeeds; never show empty or placeholder sessions in the saved-session list.

### Store contract

Extend the playground store with:

- `activeSessionId`: `string | null`
- `sessionStatus`: `draft | active | loading | failed`
- `draftMessages`
- `beginDraft()`
- `submitFirstMessage(message)`
- `activateSession(session)`
- `failDraft(error)`
- `discardDraft()`

`submitFirstMessage` must trim and validate the message before making a request. It should atomically move the store to `loading`, create or obtain the session, activate it only after success, and then start generation streaming. Existing sessions continue to use the normal message endpoint.

### Session-rail rules

- The rail may show a temporary “Starting chat…” item while the first request is pending, but it must not be presented as a saved session and must not be persisted.
- On failure, remove the temporary item and keep the draft available in the conversation panel.
- “New chat” from an active session must never mutate or delete the active session; it only starts a fresh local draft.
- Refreshing an empty draft returns to the default draft state. Refreshing an active session restores it from the server.

## Product structure

### Entry page

Bring the project-selection page into the same visual system as All Projects and Community:

- Mint or lilac pastel hero block.
- Clear heading: “Design with AI.”
- Searchable project cards with equal widths and consistent pastel headers.
- Loading skeletons, empty state, and retryable error state.
- Keep navigation into the existing project workspace intact.

### Playground workspace

Use three independently scrollable areas:

1. Session rail
   - New session action.
   - Search and rename sessions.
   - Active-session state.
   - Delete confirmation with loading state.

2. Conversation panel
   - User and assistant messages with clear hierarchy.
   - Starter prompts for typography, color, spacing, and component patterns.
   - Composer with auto-resize, Enter-to-send, Shift+Enter for a newline, and disabled sending state.
   - Streaming “Thinking” and progress status.
   - Retry action when generation fails.

3. Design system panel
   - Live preview.
   - Token inspector.
   - Component gallery.
   - Responsive desktop/mobile preview modes.
   - Fullscreen and reset actions.

## Real-time design-system update flow

### Transport

Use Server-Sent Events for the first streaming implementation. The interaction is primarily server-to-client while a generation is running, and SSE is simpler to reconnect and authorize than introducing a second bidirectional socket protocol.

Recommended API shape:

```text
POST /playground/:sessionId/message
  → returns { generationId }

GET /playground/:sessionId/stream?generationId=...
  → text/event-stream
```

If the existing deployment cannot support SSE reliably, use a WebSocket channel with the same event contract. Do not change the frontend event model when changing transports.

### Event contract

Every event should include `generationId`, `sessionId`, and a monotonically increasing `sequence` value.

```json
{ "type": "generation.started", "generationId": "..." }
{ "type": "assistant.delta", "content": "..." }
{ "type": "tokens.patch", "patch": { "colors.primary": "#111111" } }
{ "type": "preview.updated", "changedPaths": ["colors.primary"] }
{ "type": "artifact.updated", "artifact": { "kind": "tokens", "status": "ready" } }
{ "type": "generation.completed", "session": { "...": "..." } }
{ "type": "generation.failed", "message": "...", "retryable": true }
```

### Token update strategy

Do not replace the entire token object for every streamed change. Use shallow path patches so the preview can update without losing unrelated user choices.

Example:

```json
{
  "colors.primary": "#1f1d3d",
  "typography.headingFont": "Inter",
  "radius.md": "12px"
}
```

The client should:

1. Keep the last confirmed token snapshot.
2. Apply incoming patches optimistically to a draft token snapshot.
3. Render the draft snapshot in `LiveSandbox` immediately.
4. Mark changed token rows as updating until the server confirms them.
5. Replace the draft with the final persisted session snapshot on completion.
6. Roll back only the unfinished generation on failure.

### Store changes

Extend the playground store with:

- `designTokens`
- `confirmedTokens`
- `pendingTokenPaths`
- `generationId`
- `generationStatus`: `idle | starting | streaming | completed | failed`
- `streamedAssistantMessage`
- `lastGenerationError`
- `applyTokenPatch(patch)`
- `confirmGeneration(session)`
- `rollbackGeneration()`
- `resetGeneration()`

The store should be the single source of truth for chat streaming and live token updates. `Playground.jsx` should remain focused on layout and user interaction.

## Live preview improvements

Refactor `LiveSandbox` into smaller preview sections:

- Hero and button examples.
- Typography scale.
- Color roles and contrast labels.
- Form controls.
- Cards, badges, and navigation.
- Radius and spacing examples.

Each section should consume the same token object and animate only the properties that changed. Use short color/opacity transitions, avoid layout animation during token updates, and respect `prefers-reduced-motion`.

Add a compact token inspector beside or below the preview:

- Group tokens by Colors, Typography, Spacing, Radius, and Shadows.
- Show previous and current values while a generation is active.
- Highlight changed rows.
- Provide copy buttons only for values that are implemented.
- Add a reset-to-confirmed action for unfinished changes.

## Backend work required

- Split the current synchronous `addMessage` flow into generation creation and streaming response delivery.
- Keep assistant message persistence and final token persistence on the server.
- Emit token patches as soon as the orchestrator can safely produce them.
- Emit a final normalized token snapshot with `generation.completed`.
- Add generation cancellation so a user can stop an expensive request.
- Add timeout and reconnect handling.
- Ensure only the session owner can create, read, stream, or cancel a generation.
- Preserve the existing non-streaming response as a fallback during rollout.

## Rollout order

### Phase 1: visual foundation

- Redesign the entry page.
- Fix workspace sizing and independent scrolling.
- Split `LiveSandbox` into preview sections.
- Add token inspector UI using the current saved token object.

### Phase 2: client state

- Add draft/confirmed token state.
- Add generation status and optimistic patch application.
- Add changed-token highlighting, reset, and retry behavior.

### Phase 3: streaming transport

- Add generation endpoint and SSE stream.
- Implement the event contract.
- Stream assistant text and token patches.
- Persist the final state and reconcile the client store.

### Phase 4: polish and resilience

- Add cancel generation.
- Add reconnect handling and stale-event protection.
- Add mobile preview mode and fullscreen preview.
- Add accessible announcements for generation progress and failures.
- Add reduced-motion behavior and performance checks.

## Acceptance criteria

- A prompt visibly changes the preview before the request finishes when token patches are available.
- No completed generation can be overwritten by an older stream.
- Refreshing the session restores the last confirmed token state.
- A failed generation preserves the last confirmed design system and offers retry.
- The assistant message can stream independently from token updates.
- Preview, inspector, and exported values all read from the same normalized token snapshot.
- Session rail, chat, and preview scroll independently at desktop and mobile widths.
- The existing synchronous API remains usable while streaming is rolled out.
- Opening the Playground or clicking “New chat” without a non-empty user message creates no backend session.
- Whitespace-only submissions create no backend session.
- The first non-empty user message creates exactly one session and is included in that session’s history.
- A failed first submission leaves a retryable local draft and does not leave an empty or duplicate persisted session.
- Empty drafts never appear in the persisted session rail after navigation or refresh.
