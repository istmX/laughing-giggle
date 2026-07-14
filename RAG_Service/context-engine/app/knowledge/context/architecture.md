# Architecture

## Architecture Goals

The architecture should be:

- local-first
- maintainable
- understandable
- scalable enough for MVP

Avoid unnecessary complexity.

---

# System Overview

User Prompt / Input
       ↓
Web React Frontend Routes (Vite, React Router, Zustand)
       ↓
Backend AI Orchestrator / Prompt Generator (Node.js & Express)
       ↓
AI APIs (Groq / Mistral) & MongoDB Storage
       ↓
Project Chat Sandbox (MessageScroller) & Context Documents

---

# Storage Layers

## Layer 1

Image Storage

Technology:

Expo FileSystem

Stores:

- screenshot files

Never store images in AsyncStorage.

---

## Layer 2

Metadata Storage

Technology:

AsyncStorage

Stores:

- collections
- notes
- settings
- pinned states
- screenshot metadata

---

## Layer 3

Application State

Technology:

Zustand

Stores:

- active collection
- UI state
- selected screenshot
- filters

---

# Folder Structure

src/

app/

components/

features/

hooks/

services/

store/

types/

utils/

assets/

context/

---

# Feature Structure

features/

home/

collections/

timeline/

settings/

auth/

onboarding/

screenshots/

Each feature owns:

- components
- hooks
- services
- types

Avoid giant shared folders.

---

# State Management Rules

Use Zustand.

Do NOT use:

- Redux
- MobX
- Recoil

Keep stores focused.

Avoid monolithic stores.

---

# Async Data

Use TanStack Query.

Responsibilities:

- caching
- invalidation
- async operations

Do not misuse Zustand for server-state patterns.

---

# Authentication

Provider:

Clerk

Methods:

- Google
- Apple
- Email

Authentication must remain isolated from application state.

---

# Navigation

Bottom Tabs:

Home

Collections

Timeline

Settings

Use Expo Router.

---

# Import Flow

User selects image

↓

File copied into app storage

↓

Metadata generated

↓

Metadata saved

↓

Store updated

↓

UI refreshed

---

# Export Flow

Export metadata

↓

Export screenshots

↓

Create backup package

↓

User chooses destination

---

# Performance Rules

Use:

- FlatList
- FlashList if needed

Avoid:

- unnecessary re-renders
- expensive animations

Images must be lazy-loaded.

---

# Offline First and Authentication Boundaries

The app supports offline access for local screenshot and basic memory-curation features, but:
- **Authenticated Generation**: Accessing conversational prompts, projects creation, and managing workspaces requires authentication (JWT tokens).
- **Project-Chat & Context Sandbox**: Accessing the AI spec engine, context generation APIs, and ProjectChatPage sandbox requires an active network connection and valid session.

---

# Future Expansion

Future cloud sync features for local screenshot metadata must remain optional.
The core repository supports a hybrid model: local-first tools enhanced by cloud-backed developer utilities.
Cloud sync is an enhancement, not a blocker for local viewing, but a dependency for active AI context features.