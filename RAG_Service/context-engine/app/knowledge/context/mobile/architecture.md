# Zenix Architectural Specification — Mobile App Blueprint (Expo & React Native)

This document defines the architecture, folder structure, and data layer for ScribbleBox Mobile.

---

# 1. Architecture Goals & Mobile System Overview

Mobile architecture should be:
- local-first & offline resilient
- responsive (60fps gesture feedback)
- maintainable and type-safe

```text
User Mobile Touch Event
       ↓
Expo Router Screens (Tabs / Stacks)
       ↓
Client State (Zustand) & Local File System (Expo FileSystem / AsyncStorage)
       ↓
Backend API Sync (Express / Node.js + MongoDB)
```

---

# 2. Folder Structure Architecture

```text
app/                            # Expo Router Screen Directory
├── _layout.tsx                 # Root Stack Navigator & Providers
├── (tabs)/                     # Tab Navigator Group
│   ├── _layout.tsx             # Bottom Tab Bar Configuration
│   ├── index.tsx               # Home / Timeline Screen
│   ├── collections.tsx         # Memory Collections Screen
│   └── settings.tsx            # Settings Screen
├── modal.tsx                   # Screenshot Context Modal
└── memory/[id].tsx             # Memory Detail View
src/
├── components/                 # Reusable Mobile UI Elements
│   ├── Button.tsx              # Native touchable button
│   ├── Card.tsx                # Memory surface card
│   └── Header.tsx              # Mobile header component
├── features/                   # Feature-based logic
│   ├── collections/
│   ├── screenshots/
│   └── timeline/
├── hooks/                      # Custom Mobile Hooks
└── stores/                     # Client Zustand Stores
```

---

# 3. Mobile Layout Standards & Insets

- **Screen Insets**: Top inset `insets.top + 12px`, Bottom inset `insets.bottom + 16px`.
- **Corner Radii**: Standard `rounded-2xl` (16px) for memory cards, `rounded-full` for badges.
- **Side Margins**: `px-4` (16px) standard padding.
