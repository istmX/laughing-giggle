import { buildBasePrompt } from "./base.prompt.js";

export const buildQuestionPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Generate intelligent, non-generic clarification questions based on: "${data.idea}"

### Requirements
- Focus on removing ambiguity in requirements, architecture, and user flows.
- Do not ask questions already answered in the idea prompt.
- Generate between 5 and 15 highly specific questions.
- Each question must explain *why* clarification is needed.
`;
};
