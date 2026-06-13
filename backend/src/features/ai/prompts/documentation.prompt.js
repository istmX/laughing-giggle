import { buildBasePrompt } from "./base.prompt.js";

export const buildDocumentationPrompt = (data) => {
  return `
${buildBasePrompt()}

### Task
Generate a professional, developer-focused engineering document.
Type: ${data.docType || "README.md"}

### Content Guidelines
- Focus on technical accuracy and maintainability.
- Provide comprehensive instructions for implementation, usage, or deployment.
- Absolutely no marketing fluff.
- Use structured Markdown with clear headings and code examples where applicable.
- If documentation is for an API, include request/response payloads, endpoints, and authentication requirements.
`;
};
