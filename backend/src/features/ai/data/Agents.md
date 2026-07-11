
# ScribbleBox Agent Instructions

You are working on ScribbleBox.

Before making ANY implementation decisions, read every file inside the `/context` directory.

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

# Technology Stack

Framework:

- Expo
- React Native

Styling:

- NativeWind

State:

- Zustand

Async Data:

- TanStack Query

Storage:

- AsyncStorage
- Expo FileSystem

Authentication:

- Clerk

---

# Storage Philosophy

Images are stored locally.

Metadata is stored locally.

The app must function completely offline.

Cloud sync is not required for MVP.

Do not introduce backend complexity unless explicitly requested.

---

# Illustration Rules

Illustrations are a first-class part of the product.

All illustrations live inside:

context/assets/

Design references live inside:

context/designs/

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

context/progress-tracker.md

This is mandatory.

---

# If Unsure

Always choose:

- simpler architecture
- fewer dependencies
- better UX
- local-first solutions

Never over-engineer.