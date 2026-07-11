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

Images

↓

Expo FileSystem

↓

Metadata

↓

AsyncStorage

↓

Zustand Store

↓

UI

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

# Offline First

The app must function:

- without internet
- without authentication
- without cloud sync

Internet should never be required to access memories.

---

# Future Expansion

Future cloud sync must be optional.

The local-first architecture remains the primary architecture forever.

Cloud sync is an enhancement.

Not a dependency.