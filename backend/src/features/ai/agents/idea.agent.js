import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildIdeaPrompt } from "../prompts/idea.prompt.js";

export const ideaAgent = {
  async analyzeIdea(data) {
    const prompt = buildIdeaPrompt(data);
    return await orchestrator.execute("analyzeIdea", prompt);
  }
};
