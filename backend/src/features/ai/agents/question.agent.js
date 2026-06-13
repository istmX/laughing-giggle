import orchestrator from "../orchestrator/ai.orchestrator.js";

export const questionAgent = {
  async generateQuestions(data) {
    return await orchestrator.execute("generateQuestions", data);
  }
};
