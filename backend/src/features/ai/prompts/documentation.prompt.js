import { buildBasePrompt } from "./base.prompt.js";

export const buildDocumentationPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Generate developer-focused documentation.
Type: ${data.docType || "README.md"}

### Requirements
- Concise, implementation-ready.
- No marketing language.
- Follow markdown best practices.
`;
};
