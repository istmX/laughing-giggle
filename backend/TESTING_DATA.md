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
  "priority": "high"
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
*Check the `questions` array in the response.*

### Step 4: Submit Answers
`POST /api/ai/answers/<IDEA_ID>`
```json
{
  "answers": {
    "target_audience": "Home cooks",
    "platform": "web"
  }
}
```
*Note: Make sure the `key` matches the one generated in the previous step.*

### Step 5: Generate Context
`POST /api/ai/context/<IDEA_ID>`
*Result: Generates `project_overview`, `architecture`, `mermaid_diagram`, etc.*

### Step 6: Generate Tasks
`POST /api/ai/tasks/<IDEA_ID>`
*Result: Automatically creates a `Project` and populates it with AI-generated `Tasks`.*
