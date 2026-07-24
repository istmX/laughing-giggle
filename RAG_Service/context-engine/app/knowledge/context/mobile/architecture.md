# ScribbleBox Mobile Architectural Specification

## Architecture Goals

The ScribbleBox Mobile architecture should be:

- local-first & offline resilient
- responsive (smooth 60fps gesture feedback)
- maintainable
- understandable
- type-safe and performant

Avoid unnecessary complexity.

---

# System Overview

User Mobile Touch Event
       ↓
Expo Router Screens (Tabs / Stacks with NativeWind Utility Styling)
       ↓
Zustand Client Stores & Local Storage Layer (Expo FileSystem + AsyncStorage)
       ↓
Backend Sync API (Express / Node.js + MongoDB / PostgreSQL)
       ↓
ScribbleBox Memory Journal Archive

---

# Storage Layers

## Layer 1

Image File Storage

Technology:

Expo FileSystem

Stores:

- screenshot files on local device storage

Never store raw image binary strings in AsyncStorage.

---

## Layer 2

Metadata Storage

Technology:

AsyncStorage

Stores:

- workspace collections
- screenshot notes
- app settings
- pinned memory states
- screenshot metadata timestamps

---

## Layer 3

Application Client State

Technology:

Zustand

Stores:

- active collection
- UI drawer / modal state
- selected screenshot
- global search filters

---

# Folder Structure

app/

src/

components/

features/

hooks/

services/

stores/

types/

utils/

assets/

---

# Feature Structure

features/

home/

collections/

timeline/

settings/

screenshots/

Each feature owns:

- components
- hooks
- services
- types

Avoid giant shared folders.

---

# Mobile Layout Boundaries & Safe Areas

- **Top Inset**: `insets.top + 12px` (Accounts for iPhone notch / dynamic island & Android status bar).
- **Bottom Inset**: `insets.bottom + 16px` (Accounts for home indicator bar).
- **Side Padding**: `px-4` (16px) standard phone margin, `px-6` (24px) tablet margin.
- **Corner Radii**: `rounded-2xl` (16px) for memory cards, `rounded-full` for pill badges.
- **Touch Target Boundary**: Minimum height `44px` (`min-h-[44px]`), minimum width `44px` (`min-w-[44px]`).

---

# State Management Rules

Use Zustand.

Do NOT use:

- Redux
- MobX
- Recoil

Keep stores focused (<150 lines).

Avoid monolithic stores.

---

# Async Data

Use TanStack Query.

Responsibilities:

- caching
- invalidation
- async network workflows

Do not misuse Zustand for server-state patterns.

---

# Authentication

Provider:

Clerk (`@clerk/clerk-expo`)

Methods:

- Google
- Apple
- Email

Authentication must remain isolated from application client state.

---

# Navigation Map & Expo Router Layout

Root Stack (`app/_layout.tsx`):

├── (tabs)/ (`app/(tabs)/_layout.tsx` - 64px height bottom tab bar)
│   ├── index (Home / Timeline Tab)
│   ├── collections (Memory Collections Tab)
│   └── settings (Settings Tab)
├── modal (Slide-up Context Note Modal)
└── memory/[id] (Memory Detail View Stack)

---

# Screenshot Import Flow

User taps "Import Screenshot" button
       ↓
Native media picker opens
       ↓
File binary copied into Expo FileSystem (`FileSystem.documentDirectory`)
       ↓
Screenshot metadata object created (UUID, timestamp, collection ID)
       ↓
Metadata stored in AsyncStorage & Zustand store updated
       ↓
UI feeds & timeline automatically refresh

---

# Backup Export Flow

Export screenshot metadata JSON
       ↓
Export screenshot binary files from Expo FileSystem
       ↓
Generate compressed zip package
       ↓
User selects mobile share sheet destination

---

# Performance & Native Optimization Rules

Use:

- Virtualized lists (`FlatList` or `FlashList`) for memory feeds
- `React Native Reanimated` for 60fps gesture animations
- Image caching and lazy-loading

Avoid:

- large inline style objects
- JS thread blocking operations
- unnecessary component re-renders

---

# Offline-First Boundaries

The app supports complete offline access for local screenshot import, context note creation, and memory timeline viewing.
Network access is required ONLY for authentication token refresh, cloud backups, and AI context generation APIs.
