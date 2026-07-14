# Library Documentation

## Purpose

Documents approved libraries for ScribbleBox.

New libraries should not be added unless necessary.

Keep dependencies minimal.

---

# Expo

Purpose:

Application framework.

Responsibilities:

- native APIs
- builds
- routing support
- filesystem

Documentation:

https://docs.expo.dev

---

# Expo Router

Purpose:

Navigation.

Responsibilities:

- tabs
- stacks
- protected routes

Documentation:

https://docs.expo.dev/router

---

# NativeWind

Purpose:

Styling.

Responsibilities:

- utility classes
- responsive design
- consistent UI

Documentation:

https://www.nativewind.dev

---

# Zustand

Purpose:

Global state.

Responsibilities:

- collections
- settings
- selected items

Rules:

Keep stores small.

Documentation:

https://zustand-demo.pmnd.rs

---

# TanStack Query

Purpose:

Async state.

Responsibilities:

- caching
- invalidation
- async workflows

Documentation:

https://tanstack.com/query

---

# AsyncStorage

Purpose:

Metadata persistence.

Stores:

- collections
- notes
- settings
- preferences

Do NOT store image files.

Documentation:

https://react-native-async-storage.github.io

---

# Expo FileSystem

Purpose:

File storage.

Stores:

- screenshots

Do NOT store screenshots in AsyncStorage.

Documentation:

https://docs.expo.dev/versions/latest/sdk/filesystem

---

# Clerk

Purpose:

Authentication.

Methods:

- Google
- Apple
- Email

Documentation:

https://clerk.com/docs

---

# Lucide React Native

Purpose:

Icons.

Rules:

Use Lucide only.

Do not mix icon packs.

Documentation:

https://lucide.dev

---

# React Hook Form

Purpose:

Forms.

Used For:

- Login
- Signup
- Collection creation
- Notes

Documentation:

https://react-hook-form.com

---

# Zod

Purpose:

Validation.

Used For:

- form validation
- schema validation

Documentation:

https://zod.dev

---

# Approved Libraries

## Web Frontend
- `react`, `react-dom` (Core Framework)
- `react-router-dom` (Routing)
- `zustand` (State Management)
- `tailwindcss`, `tailwind-merge`, `clsx` (Styling & Class Utilities)
- `lucide-react` (Icons)
- `gsap`, `@gsap/react` (Animations & Timelines)
- `framer-motion`, `motion-dom` (Transition Animations)
- `lenis` (Smooth Scrolling)

## Mobile Client (Legacy/Mobile)
- `expo`, `expo-router` (Framework)
- `nativewind` (Styling)
- `zustand` (State)
- `@tanstack/react-query` (Async Fetching)
- `@react-native-async-storage/async-storage` (Local Storage)
- `expo-file-system` (File Management)
- `@clerk/clerk-expo` (Authentication)
- `react-hook-form`, `zod` (Forms & Validation)

## Backend
- `express` (Server)
- `mongoose` (MongoDB ORM)
- `jsonwebtoken`, `bcryptjs` (Security)
- `groq-sdk` (Groq AI integration)
- `cors`, `dotenv` (System Utilities)

---

# Library Philosophy

Before installing a dependency ask:

Can this be solved with existing libraries?

If yes:

Do not install another package.

Keep the dependency graph small.

Keep maintenance simple.