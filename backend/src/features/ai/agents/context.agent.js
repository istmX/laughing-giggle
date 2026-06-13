import orchestrator from "../orchestrator/ai.orchestrator.js";

export const contextAgent = {
  async generateContext(data) {
    return await orchestrator.execute("generateContext", data);
  }
};
