# Prompt System Implementation Report

## Summary
A centralized, provider-agnostic, and reusable prompt system has been implemented for Zenix. This system enables consistent, structured AI outputs across different models (Gemini, Groq, DeepSeek).

## New Files
- `src/features/ai/prompts/base.prompt.js`
- `src/features/ai/prompts/idea.prompt.js`
- `src/features/ai/prompts/question.prompt.js`
- `src/features/ai/prompts/context.prompt.js`
- `src/features/ai/prompts/task.prompt.js`
- `src/features/ai/prompts/documentation.prompt.js`

## Architecture Decisions
- **Modularity:** Prompt builders are separated into task-specific modules.
- **Shared Instructions:** `base.prompt.js` serves as the single source of truth for AI agent roles, rules, and principles.
- **Provider-Agnostic:** Prompts do not contain model-specific instructions, ensuring compatibility across all providers.
- **Structured Output:** All prompt builders are designed to enforce structured (JSON) outputs for easier parsing and validation.

## Prompt Strategy
The system uses a hierarchy:
1. **Base Prompt:** Sets the persona (Architect, CTO, etc.) and global rules (security, scalability, no fluff).
2. **Task Prompts:** Import the base prompt and append task-specific context, output requirements, and goals.

## Progress Update
`progress-tracker.md` has been updated to include the prompt system implementation.

## Git Commit
`feat(ai): implement agent prompt system`

## Remaining Work
- Integrate these prompt builders into the existing Agents.
