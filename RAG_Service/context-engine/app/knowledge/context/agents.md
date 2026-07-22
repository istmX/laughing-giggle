# ScribbleBox Agent Instructions & Operating Rules

You are working on ScribbleBox.

Before making ANY implementation decisions, read every file inside the repository-relative `backend/src/features/ai/data/context` directory.
The context files are the source of truth.
Never make assumptions that contradict the context documents.

---

# What Is ScribbleBox?

ScribbleBox is a screenshot memory journal.

It is NOT:
- a gallery app
- a file manager
- a cloud storage service
- a productivity tool

It IS:
- a memory box
- a screenshot journal
- a scrapbook
- a personal archive

Users save screenshots because they represent something meaningful.
The purpose of ScribbleBox is to preserve the context behind screenshots.
A screenshot without context is just an image.
A screenshot with context becomes a memory.

---

# Core Product Philosophy

The product should feel:
- playful
- welcoming
- personal
- human
- emotional

The product should NOT feel:
- corporate
- enterprise
- sterile
- technical
- productivity-focused

---

# Design Philosophy

Every screen should feel like:
"A scrapbook made by a thoughtful designer."

The visual identity is inspired by:
- sketchbooks
- journals
- scrapbooks
- notebooks
- memory boxes

Avoid:
- glassmorphism
- neumorphism
- overly futuristic UI
- enterprise dashboards
- dense interfaces

---

# Development Priorities

Priority order:
1. User Experience
2. Design Consistency
3. Simplicity
4. Performance
5. Code Quality
6. Scalability

Never sacrifice UX for architecture complexity.

---

# Storage Philosophy

Images and project specifications are stored via the backend API in MongoDB.
The app supports local memory curation features, but authenticated project-chat and context-generation require backend connectivity.
Do not introduce unrelated architectural layers unless explicitly requested.

---

# Illustration Rules

Illustrations are a first-class part of the product.
All illustrations live inside:
`context/assets/`

Design references live inside:
`context/designs/`

Illustrations must:
- use transparent backgrounds
- follow the ScribbleBox mascot style
- use soft pastel colors
- use hand-drawn outlines
- remain consistent across the app

---

# Empty State Rules

Every empty state requires:
1. Illustration
2. Title
3. Description
4. Primary Action

Never leave users staring at blank screens.

---

# Progress Tracking

Whenever work is completed:
Update:
`context/progress-tracker.md`
This is mandatory.

---

# If Unsure

Always choose:
- simpler architecture
- fewer dependencies
- better UX
- local-first solutions

Never over-engineer.

---

# Code Standards

## Purpose

This section defines how code should be written inside ScribbleBox.
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
Target: < 200 lines
Hard Limit: 300 lines

### Screen Files
Target: < 300 lines
Hard Limit: 500 lines

### Store Files
Target: < 250 lines

## Component Rules

Every component should have:
Single responsibility

Bad:
One component that handles:
- fetching
- rendering
- forms
- business logic

Good:
Separate responsibilities.

## Naming Conventions

### Components
PascalCase
Example:
`CollectionCard.tsx`
`PinnedMemoryCard.tsx`

### Hooks
useSomething
Example:
`useCollections.ts`
`useImportScreenshot.ts`

### Stores
something.store.ts
Example:
`collections.store.ts`
`settings.store.ts`

### Types
something.types.ts
Example:
`collection.types.ts`
`screenshot.types.ts`

## Folder Structure

```text
features/
├── home/
├── collections/
├── timeline/
├── settings/
├── auth/
├── onboarding/
└── screenshots/
```

Each feature owns:
- components
- hooks
- services
- types

## State Management

Use Zustand only.
Do not introduce:
- Redux
- MobX
- Recoil
- Context-based global state
unless explicitly required.

## Async Operations

Use TanStack Query.
Examples:
- importing screenshots
- loading collections
- backups

Avoid manual loading state management.

## TypeScript Rules (Scoped to TS Packages)

For packages using TypeScript:
- Strict mode is enabled.
- Avoid using `any`.
- Never use `// @ts-ignore` unless absolutely necessary.

*Note: For the web frontend and backend modules, standard JavaScript (ES Modules) is used.*

## Styling Rules (Package Bound)

- **Web Frontend**: Use standard Tailwind CSS utility classes and Vanilla CSS. Use components styled via className variables.
- **Mobile Client**: Use NativeWind utility classes and avoid large inline styles or giant StyleSheet files.

## Reusable Components

Before creating a component ask:
Can an existing component be reused?
Duplicate UI is not allowed.

## Error Handling

Every async action must:
- Handle errors
- Handle loading states
- Handle empty states

## Comments

Only write comments when:
The reasoning is not obvious.
Never comment obvious code.

Bad:
```javascript
// increment count
count++
```

Good:
Explain WHY.

## Imports Order

1. React
2. Libraries
3. Internal Components
4. Hooks
5. Types
6. Styles

## Performance

Avoid:
- unnecessary re-renders
- expensive computations
- large object creation in render

Use memoization only when necessary.

## Golden Rule

Readable code beats clever code.

---

# Library Documentation

## Purpose

Documents approved libraries for ScribbleBox.
New libraries should not be added unless necessary.
Keep dependencies minimal.

## Approved Libraries & References

### Expo
Purpose: Application framework.
Responsibilities:
- native APIs
- builds
- routing support
- filesystem
Documentation: https://docs.expo.dev

### Expo Router
Purpose: Navigation.
Responsibilities:
- tabs
- stacks
- protected routes
Documentation: https://docs.expo.dev/router

### NativeWind
Purpose: Styling.
Responsibilities:
- utility classes
- responsive design
- consistent UI
Documentation: https://www.nativewind.dev

### Zustand
Purpose: Global state.
Responsibilities:
- collections
- settings
- selected items
Rules: Keep stores small.
Documentation: https://zustand-demo.pmnd.rs

### TanStack Query
Purpose: Async state.
Responsibilities:
- caching
- invalidation
- async workflows
Documentation: https://tanstack.com/query

### AsyncStorage
Purpose: Metadata persistence.
Stores:
- collections
- notes
- settings
- preferences
Do NOT store image files.
Documentation: https://react-native-async-storage.github.io

### Expo FileSystem
Purpose: File storage.
Stores:
- screenshots
Do NOT store screenshots in AsyncStorage.
Documentation: https://docs.expo.dev/versions/latest/sdk/filesystem

### Clerk
Purpose: Authentication.
Methods:
- Google
- Apple
- Email
Documentation: https://clerk.com/docs

### Lucide React Native
Purpose: Icons.
Rules: Use Lucide only. Do not mix icon packs.
Documentation: https://lucide.dev

### React Hook Form
Purpose: Forms.
Used For:
- Login
- Signup
- Collection creation
- Notes
Documentation: https://react-hook-form.com

### Zod
Purpose: Validation.
Used For:
- form validation
- schema validation
Documentation: https://zod.dev

## Library Whitelist Matrix

### Web Frontend
- `react`, `react-dom` (Core Framework)
- `react-router-dom` (Routing)
- `zustand` (State Management)
- `tailwindcss`, `tailwind-merge`, `clsx` (Styling & Class Utilities)
- `lucide-react` (Icons)
- `gsap`, `@gsap/react` (Animations & Timelines)
- `framer-motion`, `motion-dom` (Transition Animations)
- `lenis` (Smooth Scrolling)

### Mobile Client (Legacy/Mobile)
- `expo`, `expo-router` (Framework)
- `nativewind` (Styling)
- `zustand` (State)
- `@tanstack/react-query` (Async Fetching)
- `@react-native-async-storage/async-storage` (Local Storage)
- `expo-file-system` (File Management)
- `@clerk/clerk-expo` (Authentication)
- `react-hook-form`, `zod` (Forms & Validation)

### Backend
- `express` (Server)
- `mongoose` (MongoDB ORM)
- `jsonwebtoken`, `bcryptjs` (Security)
- `groq-sdk` (Groq AI integration)
- `cors`, `dotenv` (System Utilities)

## Library Philosophy

Before installing a dependency ask:
Can this be solved with existing libraries?
If yes: Do not install another package.
Keep the dependency graph small.
Keep maintenance simple.

---

# Build Plan

## Purpose

Defines the implementation order.
Features should be built in this exact sequence.
Do not skip ahead.

## Phase 1: Project Setup
Status: Planned
Tasks:
- Create Expo project
- Configure TypeScript
- Configure NativeWind
- Configure Expo Router
- Configure ESLint
- Configure Prettier
Deliverable: Clean running project.

## Phase 2: Design System
Status: Planned
Tasks:
- Implement colors
- Implement typography
- Implement spacing
- Implement reusable buttons
- Implement reusable cards
Deliverable: Reusable design foundation.

## Phase 3: Illustration Integration
Status: Planned
Tasks:
- Add onboarding illustrations
- Add auth illustration
- Add empty state illustrations
Deliverable: All assets integrated.

## Phase 4: Onboarding
Status: Planned
Tasks:
- Welcome Screen
- Organize Screen
- Remember Screen
Deliverable: Complete onboarding flow.

## Phase 5: Authentication
Status: Planned
Tasks:
- Clerk setup
- Google login
- Apple login
- Email login
Deliverable: Working authentication.

## Phase 6: Navigation
Status: Planned
Tasks:
- Bottom tabs
- Navigation structure
- Protected routes
Deliverable: App navigation complete.

## Phase 7: Collections
Status: Planned
Tasks:
- Collection model
- Collection cards
- Collection list
- Create collection flow
Deliverable: Users can organize screenshots.

## Phase 8: Screenshot Import
Status: Planned
Tasks:
- Media picker
- File system integration
- Metadata creation
- Storage service
Deliverable: Screenshots can be imported.

## Phase 9: Screenshot Details
Status: Planned
Tasks:
- Image preview
- Notes
- Pinning
- Metadata display
Deliverable: Memory creation workflow.

## Phase 10: Home Screen
Status: Planned
Tasks:
- Greeting
- Pinned memories
- Recent screenshots
- Empty state
Deliverable: Functional dashboard.

## Phase 11: Timeline
Status: Planned
Tasks:
- Calendar view
- Date grouping
- Empty state
Deliverable: Journal experience.

## Phase 12: Settings
Status: Planned
Tasks:
- Storage screen
- Import backup
- Export backup
- Clear data
Deliverable: Settings complete.

## Phase 13: Polish
Status: Planned
Tasks:
- Animations
- Accessibility
- Performance
- Bug fixes
Deliverable: Production-ready app.

## MVP Definition

MVP includes:
✓ Onboarding
✓ Authentication
✓ Import screenshots
✓ Collections
✓ Notes
✓ Timeline
✓ Settings

Anything else is optional.

## Out of Scope

Not MVP:
- OCR
- Cloud Sync
- Sharing
- Collaboration
- Social Features
Ignore these until requested.
