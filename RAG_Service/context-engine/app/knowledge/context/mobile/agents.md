# ScribbleBox Mobile Agent Instructions & Operating Rules

You are working on ScribbleBox Mobile.

Before making ANY implementation decisions, read every file inside the repository-relative `RAG_Service/context-engine/app/knowledge/context/mobile` directory.
The context files are the source of truth.
Never make assumptions that contradict the context documents.

---

# What Is ScribbleBox Mobile?

ScribbleBox Mobile is a native iOS and Android screenshot memory journal app built with Expo and React Native.

It is NOT:
- a generic gallery app
- a raw file manager
- an unorganized cloud bucket
- a sterile productivity tool
- a complex, desktop-centric web portal

It IS:
- a personal memory box
- a screenshot journal with deep context retention
- a scrapbook archive
- an offline-first mobile app

Users save screenshots on their mobile devices because they represent something meaningful.
The purpose of ScribbleBox Mobile is to preserve the context behind mobile screenshots.
A screenshot without context is just an image in a photo roll.
A screenshot with context becomes a memory.

---

# Core Product Philosophy

The mobile product should feel:
- playful
- welcoming
- personal
- human
- emotional
- native & responsive (smooth 60fps gesture feedback)

The mobile product should NOT feel:
- corporate
- enterprise-sterile
- sterile
- technical for the sake of being technical
- productivity-focused without warmth

---

# Design Philosophy

Every screen should feel like:
"A sketchbook scrapbook made by a thoughtful designer for mobile devices."

The visual identity is inspired by:
- sketchbooks
- journals
- scrapbooks
- notebooks
- memory boxes

Avoid:
- glassmorphism clutter
- neumorphism
- overly futuristic UI
- enterprise dashboards
- dense, unreadable mobile interfaces

---

# Development Priorities

Priority order:
1. User Experience & Native Responsiveness
2. Touch Target Safety & Accessibility
3. Simplicity
4. Performance & Smooth 60fps Gesture Motion
5. Code Quality
6. Scalability

Never sacrifice mobile UX for architecture complexity.

---

# Storage Philosophy

Images are stored natively on the device file system via Expo FileSystem.
Metadata, collections, notes, and preferences are persisted locally using AsyncStorage and Zustand stores.
Do NOT store raw image files in AsyncStorage.
The app supports local memory curation completely offline, but backup sync and context generation features require backend API connectivity.

---

# Touch Targets & Safe Area Rules

1. **Touch Target Size**: Minimum hit target area MUST be `44px` x `44px` (`min-h-[44px] min-w-[44px]`). Always use `Pressable` or `TouchableOpacity` with active feedback (`active:opacity-80` or `active:scale-98`).
2. **Safe Area Insets**: Always wrap top and bottom screen boundaries using `useSafeAreaInsets()` from `react-native-safe-area-context`.
3. **Screen Padding**: Standard side padding is `px-4` (16px) on mobile viewports and `px-6` (24px) on tablets.

---

# Empty State Rules

Every empty state requires:
1. Illustration / Mascot Icon
2. Title (e.g. "Your memory box is empty")
3. Description
4. Primary Action Button ("Import Screenshot")

Never leave users staring at blank screens.

---

# Progress Tracking

Whenever work is completed:
Update:
`context/progress-tracker.md`
This is mandatory.

---

# Code Standards

## Purpose

This section defines how code should be written inside ScribbleBox Mobile.
Consistency is more important than personal preference.
When uncertain:
Follow these standards.

## Core Principles

Write code for humans first.
Write code for machines second.
The next developer should understand the code without explanation.

## Preferred Style

Always prefer:
- readability
- simplicity
- maintainability

Avoid:
- clever code
- unnecessary abstractions
- premature optimization

## File Size Rules

### Component Files
Target: < 150 lines
Hard Limit: 200 lines

### Screen Files (`app/` tabs & stacks)
Target: < 200 lines
Hard Limit: 300 lines

### Store Files (`src/stores/`)
Target: < 150 lines

## Component Rules

Every component should have:
Single responsibility

Bad:
One component that handles image picking, file copying, metadata generation, rendering, and store updates.

Good:
Separate responsibilities (`useImportScreenshot.ts`, `MemoryCard.tsx`, `Header.tsx`).

## Naming Conventions

### Components
PascalCase
Example:
`CollectionCard.tsx`
`PinnedMemoryCard.tsx`
`Header.tsx`

### Hooks
useSomething
Example:
`useCollections.ts`
`useImportScreenshot.ts`

### Stores
useSomethingStore.ts
Example:
`useCollectionsStore.ts`
`useSettingsStore.ts`

### Types
something.types.ts
Example:
`collection.types.ts`
`screenshot.types.ts`

## Folder Structure

```text
app/                            # Expo Router Screen Directory
├── _layout.tsx                 # Root Stack Navigator & Providers
├── (tabs)/                     # Tab Navigator Group
│   ├── _layout.tsx             # Bottom Tab Bar Configuration
│   ├── index.tsx               # Home / Timeline Tab Screen
│   ├── collections.tsx         # Memory Collections Screen
│   └── settings.tsx            # Settings Screen
├── modal.tsx                   # Context Note Modal Screen
└── memory/[id].tsx             # Memory Detail Stack Screen
src/
├── components/                 # Reusable Native UI Elements
│   ├── Button.tsx              # Native touchable button
│   ├── Card.tsx                # Memory surface card
│   └── Header.tsx              # Mobile header component
├── features/                   # Feature-based architecture
│   ├── home/
│   ├── collections/
│   ├── screenshots/
│   ├── timeline/
│   └── settings/
├── hooks/                      # Custom Mobile Hooks
└── stores/                     # Client Zustand Stores
```

## State Management

Use Zustand for client state.
Do NOT use Redux, MobX, or Recoil.

## Async Operations

Use TanStack Query for async network requests and metadata queries.

## Styling Rules (NativeWind & Tailwind)

- Use NativeWind utility classes (`className="..."`).
- Avoid large inline style objects or massive `StyleSheet.create` blocks.
- Text Wrapping Safety: Wrap text nodes inside flex items with proper padding and container bounds (`min-w-0`).
- Semantic Color Tokens: Never hardcode hex values in components; use theme tokens.

---

# Approved Mobile Whitelist Matrix

### Core Framework & Navigation
- `expo` (SDK 54+ framework)
- `expo-router` (File-based navigation)
- `react-native` (Native mobile core)

### Styling & UI
- `nativewind` (Tailwind CSS for React Native)
- `lucide-react-native` (Native SVG icon pack)

### State & Storage
- `zustand` (Global state)
- `@tanstack/react-query` (Async fetching)
- `@react-native-async-storage/async-storage` (Metadata persistence)
- `expo-file-system` (Local image file storage)

### Forms & Auth
- `@clerk/clerk-expo` (Authentication)
- `react-hook-form`, `zod` (Form handling & validation)

---

# Build Plan

## Phase 1: Expo Setup & Dependencies
Configure Expo SDK, TypeScript, NativeWind, Babel, Metro, and global CSS styling.

## Phase 2: Navigation & Root Layout
Configure Expo Router root stack (`app/_layout.tsx`) and bottom tabs (`app/(tabs)/_layout.tsx`).

## Phase 3: Design Tokens & Reusable UI Components
Build reusable `Button.tsx`, `Card.tsx`, and `Header.tsx` components with `44px` touch target compliance.

## Phase 4: Screenshot Import & FileSystem Integration
Build media picker integration, copy image binary to `expo-file-system`, and update Zustand metadata.

## Phase 5: Memory Details & Context Note Editor
Build modal drawer (`app/modal.tsx`) for attaching notes, pins, and date tags to screenshots.

## Phase 6: Home & Timeline Screens
Build Home tab with pinned memories, recent activity, and calendar timeline grouping.

## Phase 7: Mobile Audit & Production Verification
Audit touch targets (>44px height), check safe areas across iOS/Android, and run build verification.
