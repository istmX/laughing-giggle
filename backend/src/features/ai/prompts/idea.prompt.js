import { buildBasePrompt } from "./base.prompt.js";

export const buildIdeaPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Analyze the user's project idea: "${data.idea}"
Context (if any): ${data.brief || "None"}

### Role
Think like a Senior Product Manager. Focus on scope, requirements, and feasibility.

### Output Requirements
Return a structured JSON object containing:
- project understanding
- missing requirements
- missing technical details
- completeness score (0-100)
- recommendation
`;
};
