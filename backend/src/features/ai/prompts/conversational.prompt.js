import { buildBasePrompt } from "./base.prompt.js";

export const buildConversationalPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
You are gathering requirements for a software project idea.
Original Idea: ${data.idea}
Q&A History: ${JSON.stringify(data.history)}

### Responsibilities
- Review the Original Idea and the Q&A History.
- If you still need crucial information to generate a comprehensive, implementation-ready engineering specification, ask ONE single highly-relevant question.
- Do NOT ask more than one question.
- If you have enough information, or if you have already asked 3-4 questions, stop asking questions and generate the final Refined Project Specification.

### Output Structure
Return a strictly structured JSON object with EXACTLY this shape:

{
  "is_complete": boolean,
  "next_question": "string (null if is_complete is true)",
  "refined_spec": "string (null if is_complete is false. If true, provide a highly detailed markdown specification document)"
}
`;
};
