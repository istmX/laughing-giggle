import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildContextPrompt } from "../prompts/context.prompt.js";

export const contextAgent = {
  async generateContext(data) {
    const prompt = buildContextPrompt(data);
    return await orchestrator.execute("generateContext", prompt);
  }
};
