import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildIdeaPrompt } from "../prompts/idea.prompt.js";

export const ideaAgent = {
  async analyzeIdea(data) {
    if (!data || typeof data.idea !== 'string' || data.idea.trim() === '') {
      throw new Error('Invalid input: data.idea must be a non-empty string');
    }
    const prompt = buildIdeaPrompt(data);
    return await orchestrator.execute("analyzeIdea", prompt);
  }
};
