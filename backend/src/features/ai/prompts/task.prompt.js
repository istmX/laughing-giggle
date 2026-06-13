import { buildBasePrompt } from "./base.prompt.js";

export const buildTaskPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Generate AI-development implementation tasks for: "${data.idea}"

### Task Structure
Each task must include:
- title
- description
- objective
- required_context (e.g., agents.md, architecture.md)
- implementation_steps
- expected_files
- success_criteria

### Goal
Tasks must be directly usable as prompts for AI coding assistants.
`;
};
