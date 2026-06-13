# Zenix API Reference

## Base URL
`http://localhost:3000/api`

---

## Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user. Payload: `name`, `username`, `email`, `password`. |
| `POST` | `/auth/login` | Login. Payload: `email`, `password`. Returns `token`. |

---

## Project & Idea Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/projects` | Create project. Payload: `project_title`, `project_description`. |
| `POST` | `/ideas` | Create project idea. Payload: `prompt`. |
| `GET` | `/ideas` | List ideas. |
| `PATCH` | `/brief/:briefId`| Update brief answers. Payload: `answers` (object). |

---

## AI Agent Workflow
*All endpoints require `Authorization: Bearer <JWT_TOKEN>`.*

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/ai/analyze/:ideaId` | Analyze idea quality and requirements. |
| `POST` | `/ai/questions/:ideaId` | Generate clarification questions. |
| `POST` | `/ai/context/:ideaId` | Generate dev context (docs, diagrams). |
| `POST` | `/ai/tasks/:ideaId` | Generate implementation missions (tasks). |
| `POST` | `/ai/documentation/:ideaId` | Generate markdown docs. |

---

## Implementation Mission Structure (Task Output)
```json
{
  "title": "String",
  "description": "String",
  "ai_prompt": "String",
  "required_context": ["Array of Strings"],
  "implementation_steps": ["Array of Strings"],
  "expected_files": ["Array of Strings"],
  "success_criteria": ["Array of Strings"],
  "complexity": "Low | Medium | High"
}
```
