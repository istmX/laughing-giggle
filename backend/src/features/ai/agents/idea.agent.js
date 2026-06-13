import orchestrator from "../orchestrator/ai.orchestrator.js";

export const ideaAgent = {
  async analyzeIdea(data) {
    return await orchestrator.execute("analyzeIdea", data);
  }
};
