import { executeWithFallback } from "../graphs/fallback_chain.js";
import { buildDocumentationPrompt } from "../prompts/documentation.prompt.js";

export const documentationAgent = {
  async generateDocumentation(data) {
    const prompt = buildDocumentationPrompt(data);
    return await executeWithFallback(prompt);
  }
};
