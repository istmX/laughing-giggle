import { buildBasePrompt } from "./base.prompt.js";

export const buildQuestionPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Generate intelligent clarification questions based on: "${data.idea}"

### Requirements
- Remove ambiguity.
- Improve project planning and architecture quality.
- Questions must be specific and not generic.
- Generate between 5 and 15 questions.
`;
};
