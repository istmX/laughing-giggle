# Testing Data & Workflow Guide - Zenix Backend

Use this data to verify the API endpoints defined in `API_DOCUMENTATION.md`.

---

## 1. Authentication
### Register
`POST /api/auth/register`
```json
{
  "name": "Test User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123!"
}
```

### Login
`POST /api/auth/login`
```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

---

## 2. Project Management
### Create Project
`POST /api/projects`
```json
{
  "project_title": "AI Task Manager",
  "project_description": "A project to manage tasks using AI."
}
```

### Create Task
`POST /api/tasks/project/<PROJECT_ID>`
```json
{
  "title": "Setup database",
  "description": "Configure MongoDB connection",
  "priority": "high",
  "kanban_status": "todo"
}
```

---

## 3. AI Generation Workflow
This workflow must be executed in order.

### Step 1: Create Idea
`POST /api/ideas`
```json
{
  "prompt": "An AI-powered recipe generator based on ingredients I have in my fridge."
}
```

### Step 2: Analyze Idea
`POST /api/ai/analyze/<IDEA_ID>`
*Result: Automatically creates a `Brief` and populates `questions`.*

### Step 3: Fetch Questions
`GET /api/brief/<BRIEF_ID>`
*Check the `questions` array in the response to verify status is "pending".*

### Step 4: Submit Answers (Mapping Verification)
`POST /api/ai/answers/<IDEA_ID>`
```json
{
  "answers": {
    "application_type": "web",
    "target_audience": "Home cooks",
    "platform": "web"
  }
}
```
*Verification Checklist:*
1.  *Verify the response `brief` object has `application_type: "web"`, `target_users: "Home cooks"`, and `platform: "web"` (fields are now mapped from answers).*
2.  *Check the `questions` array in the response; verify the corresponding items now have `status: "answered"` and include the `answer` and `answeredAt` timestamps.*

### Step 5: Generate Context
`POST /api/ai/context/<IDEA_ID>`
*Result: Generates `project_overview`, `architecture`, `mermaid_diagram`, etc. Persisted to `Context` model.*

### Step 6: Generate Tasks
`POST /api/ai/tasks/<IDEA_ID>`
*Result: Automatically creates a `Project` and populates it with AI-generated `Tasks`.*



 {
    2     "application_type": "web",
    3     "target_users": "Home cooks",
    4     "platform": "web",
    5     "frontend_stack": "ai-decide",
    6     "backend_stack": "ai-decide",
    7     "database": "ai-decide",
    8     "ui_style": "ai-decide",
    9     "is_complete": false,
   10     "generated_by_ai": false,
   11     "answers": {
   12         "target_audience": "Home cooks",
   13         "platform": "web",
   14         "application_type": "web"
   15     }
   16 }