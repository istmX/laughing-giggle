import { buildBasePrompt } from "./base.prompt.js";

export const buildTaskPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Generate 10 AI-ready implementation missions for the project idea: "${data.idea}"

### Mission Structure
Each mission must include:
- title
- objective
- required_context (List specific files to read first)
- instructions
- implementation_steps
- expected_files
- success_criteria
- estimated_complexity (Low, Medium, High)

### Role
Think like a Senior Software Architect, Senior Engineering Manager, and Technical Lead.

### Goal
The generated output must be directly usable as a prompt for AI coding assistants (e.g., Cursor, Claude Code).
`;
};
