import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildContextPrompt } from "../prompts/context.prompt.js";

export const contextAgent = {
  async generateContext(data) {
    if (!data || typeof data.idea !== 'string' || data.idea.trim() === '') {
      throw new Error('Invalid input: data.idea must be a non-empty string');
    }
    const prompt = buildContextPrompt(data);
    return await orchestrator.execute("generateContext", prompt);
  }
};
