import { buildBasePrompt } from "./base.prompt.js";

export const buildIdeaPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Analyze the user's project idea: "${data.idea}"
Context: ${data.brief || "None"}

### Responsibilities
- Understand the core project vision.
- Identify missing functional requirements.
- Identify missing technical details.
- Calculate completeness score (0-100).
- Decide if the project is "complete" enough to move directly to context generation or if it requires a clarification brief.

### Output Requirements
Return a strictly structured JSON object:
{
  "is_complete": boolean,
  "completeness_score": number,
  "missing_fields": string[],
  "requires_brief": boolean,
  "analysis": "Detailed technical and product-focused analysis"
}
`;
};
