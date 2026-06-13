import { buildBasePrompt } from "./base.prompt.js";

export const buildRefinementPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Generate a Refined Project Specification based on:
1. Original Idea: ${data.idea}
2. Questions Asked: ${JSON.stringify(data.questions)}
3. User Answers: ${JSON.stringify(data.answers)}

### Responsibilities
- Create a comprehensive, implementation-ready project specification.
- Act as the single source of truth for downstream agents.
- Resolve any ambiguities identified in the Q&A process.

### Output Structure
Return a detailed Refined Project Specification document containing:
- Executive Summary
- Refined Core Vision & Objectives
- Finalized Functional Requirements
- Technical Constraints & Decisions
- User Personas & Flows
- Database Schema Overview
`;
};
