import orchestrator from "../orchestrator/ai.orchestrator.js";

export const taskAgent = {
  async generateTasks(data) {
    return await orchestrator.execute("generateTasks", data);
  }
};
