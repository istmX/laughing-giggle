import orchestrator from "../orchestrator/ai.orchestrator.js";

export const documentationAgent = {
  async generateDocumentation(data) {
    return await orchestrator.execute("generateDocumentation", data);
  }
};
