# GEMINI.md

## Project Name

Zenix

## Project Vision

Zenix is an AI-powered project planning platform that transforms rough ideas into structured development context.

The goal is not to generate code directly.

The goal is to generate high-quality context documents that can be used with AI coding assistants such as ChatGPT, Claude, Gemini, Cursor, Windsurf, GitHub Copilot, and future AI development tools.

Zenix helps developers reduce AI slop, reduce repeated prompting, reduce token usage, and improve project consistency.

---

# Core Workflow

User Idea
↓
AI Analysis
↓
Question Generation
↓
User Answers
↓
Brief Completion
↓
Context Generation
↓
Task Generation
↓
Project Planning
↓
Development

---

# Current Architecture

Backend Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google Gemini API
* Zod Validation

Frontend (Planned)

* React.js
* Javascript
* Tailwind CSS
* Liveblocks

---

# Features Completed

Authentication
* Register
* Login
* Logout
* JWT
* Blacklist Tokens
* Profile Endpoint

Projects
* Create Project
* Get Projects
* Update Project
* Delete Project

Tasks
* Create Task
* Get Tasks
* Update Task
* Delete Task

Ideas
* Create Idea
* Get Idea
* Update Idea
* Delete Idea

Briefs
* Create Brief
* Update Brief
* Get Brief

Context
* Create Context
* Update Context
* Get Context

AI
* Gemini Integration
* AI Service
* Prompt System
* Zod Validation
* Idea Analysis Endpoint

AI Question Generation
* Status: Completed
* Summary: Implemented end-to-end workflow for generating and persisting follow-up questions to refine project ideas. Uses Gemini 1.5 Flash for analysis and Zod for structured data validation.
* Models Modified: `Brief` (added `questions` array with status tracking).
* Files Modified: `ai.service.js`, `ai.controller.js`, `brief.model.js`.
* Routes: `POST /api/ai/analyze/:ideaId`, `POST /api/ai/answers/:ideaId`.

AI Context Generation
* Status: Completed
* Summary: Generates detailed Markdown-formatted technical documents (Overview, Architecture, Build Plan, etc.) including Mermaid diagrams.
* Models: `Context`.
* Persistence: Saved directly to the `Context` collection and tracked in `AIGeneration`.

AI Task Generation
* Status: Completed
* Summary: Generates actionable development tasks based on the project context.
* Models: `Project`, `Task`.
* Automation: Automatically creates a Project if one doesn't exist for the idea.

---

# Architecture Enhancements

* **Service Layer**: All business logic extracted from controllers into dedicated services (Projects, Tasks, Ideas, Briefs, AI, Context).
* **Centralized Error Handling**: Global `errorMiddleware` and `AppError` class for consistent API responses.
* **Ownership Validation**: Reusable `validateOwnership` utility for consistent authorization checks.
* **Real-time Updates**: Integrated Socket.IO for real-time AI generation status notifications.
* **Cascade Deletion**: Implemented service-level cleanup to prevent orphaned documents.
* **Rate Limiting**: Protected AI routes using `express-rate-limit`.

---

# Remaining Backend Work

Priority 1
* Completed.

Priority 2
* API Documentation
* Context Regeneration

Priority 3
* Realtime Collaboration (Liveblocks expansion)
* Kanban Board UI Support (API ready)
* Socket.IO (Base integrated)

---

# Rules For Future Development

When generating code:

1. Follow existing feature-based architecture.
2. Use Mongoose.
3. Use async/await.
4. Use ownership validation.
5. Validate ObjectIds.
6. Keep controllers thin.
7. Put AI logic in services.
8. Reuse existing models whenever possible.
9. Avoid introducing unnecessary dependencies.
10. Maintain consistency with existing coding style.

---

# Completion Tracking

When a feature is completed:

1. Move it from "In Progress" to "Completed".
2. Add implementation summary.
3. Add related routes.
4. Add related models.
5. Update architecture notes.

When all backend work is complete:

Generate:

* API_DOCUMENTATION.md
* BACKEND_ARCHITECTURE.md
* PROJECT_PROGRESS_REPORT.md
* DEPLOYMENT_GUIDE.md
* CONTRIBUTING.md

These documents should reflect the final state of the project.
