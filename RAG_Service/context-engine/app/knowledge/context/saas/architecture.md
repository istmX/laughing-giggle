# Zenix Architectural Specification — Full-Stack SaaS Blueprint

This document defines the system architecture, data models, REST API contracts, and folder structure for ScribbleBox SaaS applications.

---

# 1. Architecture Goals & System Overview

Architecture should be:
- local-first & cache-heavy
- maintainable and clear
- type-safe and performant

```text
User Input / Web Browser
       ↓
Next.js / Vite React Frontend (Zustand + TanStack Query)
       ↓
Express / Node.js API Orchestrator (Zod Input Validation)
       ↓
Database Layer (MongoDB / PostgreSQL) & AI Service (Groq / Mistral)
       ↓
SaaS Workspace & Screenshot Memory Storage
```

---

# 2. Folder Architecture

```text
src/
├── app/                        # Next.js App Router / Page Routes
│   ├── (auth)/                 # Login & Signup flows
│   ├── (dashboard)/            # SaaS Workspace & Dashboard routes
│   └── api/                    # API Route Handlers
├── features/                   # Feature-driven structure
│   ├── auth/                   # Authentication logic & UI
│   ├── collections/            # Workspace memory collections
│   ├── screenshots/            # Screenshot upload & context parser
│   └── dashboard/              # Metrics & analytics components
├── shared/                     # Reusable design system & utilities
│   ├── components/             # Reusable buttons, cards, dialogs
│   ├── hooks/                  # Global hooks
│   └── utils/                  # Formatters & constants
└── lib/                        # DB clients & API configuration
```

---

# 3. Database Schema Specification

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  memories  Memory[]
}

model Memory {
  id          String   @id @default(uuid())
  title       String
  contextText String?
  imageUrl    String
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
}
```

---

# 4. REST API Contracts

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/session` | GET | Yes | Retrieves current user session |
| `/api/memories` | GET | Yes | Fetches paginated memory journal entries |
| `/api/memories` | POST | Yes | Creates new memory entry with screenshot context |
| `/api/memories/:id` | DELETE | Yes | Removes memory entry |
