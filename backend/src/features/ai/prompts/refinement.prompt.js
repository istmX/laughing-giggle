import { buildBasePrompt } from "./base.prompt.js";

export const buildRefinementPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Refine the project specification based on the original idea, questions asked, and user answers.

### Original Idea
-----BEGIN USER INPUT-----
${data.idea}
-----END USER INPUT-----

### Questions & Answers
-----BEGIN USER INPUT-----
${JSON.stringify(data.qa)}
-----END USER INPUT-----

### Instructions
Combine the original idea with the answers to generate a detailed, implementation-ready project specification. 
This specification will serve as the source of truth for all downstream AI agents.

### Output Requirements
- Detailed project overview
- Technical constraints/decisions
- Feature list
- User personas (if applicable)
- Database schema requirements
`;
};
