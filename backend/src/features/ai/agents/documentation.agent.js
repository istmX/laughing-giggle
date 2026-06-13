import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildDocumentationPrompt } from "../prompts/documentation.prompt.js";

export const documentationAgent = {
  async generateDocumentation(data) {
    const prompt = buildDocumentationPrompt(data);
    return await orchestrator.execute("generateDocumentation", prompt);
  }
};
