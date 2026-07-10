# ZENIX BACKEND API TESTING DOCUMENTATION

## Base URL

```text
http://localhost:3000/api
```

---

# Authentication

## Register User

POST `/auth/register`

Request:

```json
{
  "name": "Aryan",
  "username": "aryan123",
  "email": "aryan@example.com",
  "password": "Password123"
}
```

## Login User

POST `/auth/login`

Request:

```json
{
  "email": "aryan@example.com",
  "password": "Password123"
}
```

*Save `token` from response to use in header: `Authorization: Bearer JWT_TOKEN`*

## Logout User

POST `/auth/logout`

Headers (Optional if using cookies):

```http
Authorization: Bearer JWT_TOKEN
```

Response:

```json
{
  "message": "Logout successful"
}
```

*Clears the `token` cookie and blacklists the provided JWT to prevent reuse.*

---

# IDEAS & BRIEFS

## Create Idea

POST `/ideas`

Headers:

```http
Authorization: Bearer JWT_TOKEN
```

Request:

```json
{
  "prompt": "Build an AI-powered project planning platform."
}
```

*Save `data._id` from response as `IDEA_ID`*

## Create Initial Brief

POST `/brief`

Request:

```json
{
  "idea": "IDEA_ID"
}
```

*Save `data._id` from response as `BRIEF_ID`*

## Update Brief (With Answers)

PATCH `/brief/:briefId`

Request:

```json
{
  "answers": {
    "authentication": "Google OAuth and Email Password",
    "deployment": "AWS",
    "database": "MongoDB"
  }
}
```

---

# AI AGENT WORKFLOW (Multi-Agent)

All routes require:

```http
Authorization: Bearer JWT_TOKEN
```

## Step 1: Analyze Idea (Groq -> DeepSeek)

POST `/ai/analyze/:ideaId`

## Step 2: Generate Clarification Questions (Groq -> DeepSeek)

POST `/ai/questions/:ideaId`

## Step 3: Generate Development Context (Gemini -> DeepSeek)

POST `/ai/context/:ideaId`

## Step 4: Generate Implementation Missions (Gemini -> DeepSeek)

POST `/ai/tasks/:ideaId`

## Step 5: Generate Documentation (Gemini -> DeepSeek)

POST `/ai/documentation/:ideaId`

---

# FULL VERIFIED TESTING FLOW

1. **Authentication**: `POST /auth/register` then `POST /auth/login` to get `JWT_TOKEN`.
2. **Define Idea**: `POST /ideas` to get `IDEA_ID`.
3. **Initialize Brief**: `POST /brief` using `IDEA_ID` to get `BRIEF_ID`.
4. **AI Analysis**: `POST /ai/analyze/IDEA_ID`.
5. **Questions & Answers**: 
   - `POST /ai/questions/IDEA_ID` to generate questions.
   - `PATCH /brief/:briefId` to answer the questions.
6. **Context & Missions**: 
   - `POST /ai/context/IDEA_ID` (Orchestrator uses Brief answers to refine output).
   - `POST /ai/tasks/IDEA_ID`.
7. **Docs**: `POST /ai/documentation/IDEA_ID`.

---

# FALLBACK TESTING

Test provider fallback mechanism:

1. Temporarily set an invalid API key in `.env` (e.g., `GROQ_API_KEY=invalid`).
2. Run `POST /ai/analyze/IDEA_ID`.
3. Observe logs for `[AI FALLBACK]`.
4. Verify `AIGeneration` record in database:
   - `model` should be the successful provider (e.g., `deepseek`).
   - `metadata` should contain `fallbackUsed: true`.

---

# PROJECTS & TASKS

## Create Project

POST `/projects`

Request:

```json
{
  "project_title": "Zenix",
  "project_description": "AI planning platform"
}
```

## Get Project Tasks

GET `/tasks/project/:projectId`

## Update Task

PATCH `/tasks/:taskId`

Request:

```json
{
  "status": "in_progress",
  "kanban_status": "review"
}
```
