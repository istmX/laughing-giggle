# API Documentation - Zenix Backend

## Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login user.
- `POST /api/auth/google-login`: Google OAuth login.
- `POST /api/auth/logout`: Logout and blacklist JWT.
- `GET /api/auth/me`: Get current user profile.

## Projects
- `POST /api/projects`: Create a project.
- `GET /api/projects`: List projects.
- `GET /api/projects/:id`: Get project by ID.
- `PATCH /api/projects/:id`: Update project.
- `DELETE /api/projects/:id`: Delete project (cascades to tasks, context).

## Tasks
- `POST /api/tasks/project/:projectId`: Create task.
- `GET /api/tasks/project/:projectId`: List tasks for project.
- `GET /api/tasks/:id`: Get task by ID.
- `PATCH /api/tasks/:id`: Update task (including `kanban_status`).
- `DELETE /api/tasks/:id`: Delete task.

## AI Generation
- `POST /api/ai/analyze/:ideaId`: Analyze idea, generate questions, save to Brief.
- `POST /api/ai/questions/:ideaId`: Fetch questions.
- `POST /api/ai/answers/:ideaId`: Submit answers, update question status.
- `POST /api/ai/context/:ideaId`: Generate project context (docs, diagrams).
- `POST /api/ai/tasks/:ideaId`: Generate project tasks from context.

## Notes
- All AI routes are protected (`authMiddleware`) and rate-limited.
- All resource endpoints require authentication and own-resource validation.
- All AI-driven endpoints emit `ai_generation_completed` or `ai_generation_failed` socket events.
