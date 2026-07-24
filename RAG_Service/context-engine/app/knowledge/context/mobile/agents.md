# Zenix AI Agent Instructions & Operating Rules — Mobile App Blueprint (Expo & React Native)

You are working on ScribbleBox Mobile app projects.

Before making ANY implementation decisions, read every file inside the project context directory.
The context files are the source of truth.
Never make assumptions that contradict the context documents.

---

# What Is ScribbleBox Mobile?

ScribbleBox Mobile is a screenshot memory journal for iOS and Android.

It is NOT:
- a gallery app
- a file manager
- a sterile productivity tool

It IS:
- a personal memory box
- a screenshot journal
- a scrapbook archive

---

# Core Product & Design Philosophy

The product should feel:
- playful, welcoming, personal, human
- native & responsive with smooth 60fps gesture transitions and touch feedback (`active:opacity-80`)
- thoughtful, sketchbook-inspired, and simple

Avoid:
- corporate/enterprise dashboards
- dense, clutter-filled interfaces
- glassmorphism or overly sterile UI

---

# Code Standards & Mobile Rules

1. **File Limits**:
   - Component Files: Target < 150 lines, Hard limit 200 lines.
   - Screen Files (`app/` tabs & stacks): Target < 200 lines.
   - Store Files (`src/stores/`): Target < 150 lines.

2. **Touch Targets & Accessibility**:
   - Minimum touch target area: `44px` x `44px` (`min-h-[44px] min-w-[44px]`).
   - Use standard Product Sans / System typography; keep body line lengths clean (45–75 characters per line).

3. **Safe Area & Layout Insets**:
   - Wrap top and bottom screen edges with `useSafeAreaInsets()` from `react-native-safe-area-context`.
   - Side padding: `px-4` (16px) or `px-6` (24px).

---

# Tech Stack & Libraries

- Framework: Expo (React Native + TypeScript)
- Navigation: Expo Router (Tab & Stack navigation)
- Styling: NativeWind (Tailwind CSS utilities)
- State & Fetching: Zustand, TanStack Query
- Icons: Lucide React Native (`lucide-react-native`)

---

# Mobile Build Roadmap

## Phase 1: Environment & Foundation
- Setup Expo, TypeScript, NativeWind styling, and safe area provider.

## Phase 2: Navigation & Tab Layout
- Configure Expo Router root stack (`app/_layout.tsx`) and bottom tabs (`app/(tabs)/_layout.tsx`).

## Phase 3: Memory Collections & Screenshots
- Implement memory cards, screenshot import flow, detail modals, and offline storage.

## Phase 4: Polish & Performance Verification
- Audit touch targets (>44px height).
- Verify smooth 60fps animations.
- Verify production build.
