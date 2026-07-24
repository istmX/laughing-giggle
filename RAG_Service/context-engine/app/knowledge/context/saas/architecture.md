# ScribbleBox SaaS Architectural Specification

## Architecture Goals

The ScribbleBox SaaS architecture should be:

- local-first & cache-heavy
- maintainable
- understandable
- scalable for multi-tenant MVP
- type-safe and resilient

Avoid unnecessary complexity.

---

# System Overview

User Prompt / Input
       ↓
Web React Frontend Routes (Vite, React Router, Zustand, TanStack Query)
       ↓
Backend AI Orchestrator / Prompt Generator (Node.js & Express with Zod Validation)
       ↓
AI APIs (Groq / Mistral) & MongoDB / PostgreSQL Storage Layer
       ↓
Project Chat Sandbox (MessageScroller) & Multi-Tenant Context Documents

---

# Storage Layers

## Layer 1

Image & File Storage

Technology:

Expo FileSystem / S3 Bucket / Local Storage Engine

Stores:

- screenshot files
- user upload assets

Never store raw image binary blobs in AsyncStorage or primary database tables.

---

## Layer 2

Metadata & Relational Storage

Technology:

AsyncStorage / PostgreSQL / MongoDB (Mongoose/Prisma ORM)

Stores:

- workspace collections
- screenshot context notes
- user settings
- pinned memory states
- screenshot metadata
- tenant organization records

---

## Layer 3

Application Client State

Technology:

Zustand

Stores:

- active collection
- active tenant / workspace
- UI modal state
- selected screenshot
- global search filters

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

sandbox/

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

# Database Schema & Relational Specifications

## PostgreSQL / Prisma Model Architecture

```prisma
model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  plan      String   @default("FREE")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]
  memories  Memory[]
  projects  Project[]
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  name           String?
  role           String       @default("MEMBER")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  memories       Memory[]
}

model Memory {
  id             String       @id @default(uuid())
  title          String
  imageUrl       String
  contextText    String?      @db.Text
  pinned         Boolean      @default(false)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Project {
  id             String       @id @default(uuid())
  title          String
  prompt         String       @db.Text
  status         String       @default("DRAFT")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  contexts       ContextFile[]
  createdAt      DateTime     @default(now())
}

model ContextFile {
  id        String   @id @default(uuid())
  filename  String
  content   String   @db.Text
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

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

Clerk / Supabase Auth

Methods:

- Google
- Apple
- Email

Authentication must remain isolated from application state.

---

# Navigation & Layout

Fixed Sidebar Navigation (240px Desktop):

Home

Collections

Developer Sandbox

Timeline

Settings

Use React Router / Next.js App Router.

---

# Import Flow

User selects image

↓

File copied into app storage engine

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

# REST API Contracts & Endpoint Specifications

| Endpoint Path | Method | Auth Required | Request Payload | Response Body |
|---|---|---|---|---|
| `/api/auth/session` | GET | Yes | None | `{ user: { id, email, role, organizationId } }` |
| `/api/memories` | GET | Yes | None | `[{ id, title, imageUrl, contextText, pinned }]` |
| `/api/memories` | POST | Yes | `{ title, imageUrl, contextText, pinned }` | `{ id, title, imageUrl, contextText, pinned }` |
| `/api/memories/:id` | DELETE | Yes | None | `{ success: true, deletedId: string }` |
| `/api/ai/generate` | POST | Yes | `{ prompt: string, workspaceId: string }` | `{ projectId: string, status: "COMPLETED", files: [...] }` |

---

# Performance Rules

Use:

- Virtualized lists (`FlatList` / `FlashList`) for memory feeds
- Image lazy-loading

Avoid:

- unnecessary re-renders
- expensive animations during scrolling

---

# Database Cascade Deletion Rules

When an Organization or Project record is deleted:
1. Deleting an `Organization` MUST cascade delete all associated `User`, `Memory`, and `Project` records.
2. Deleting a `Project` MUST cascade delete all linked `ContextFile` and AI generation records.
3. Silent orphans are strictly forbidden in backend service implementations.

---

# Offline First and Authentication Boundaries

The app supports offline access for local screenshot and basic memory-curation features, but:
- **Authenticated Generation**: Accessing conversational prompts, projects creation, and managing workspaces requires authentication (JWT tokens).
- **Project-Chat & Context Sandbox**: Accessing the AI spec engine, context generation APIs, and MessageScroller sandbox requires an active network connection and valid session.
