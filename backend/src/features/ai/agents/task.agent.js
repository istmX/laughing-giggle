import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildTaskPrompt } from "../prompts/task.prompt.js";

export const taskAgent = {
  async generateTasks(data) {
    const prompt = buildTaskPrompt(data);
    return await orchestrator.execute("generateTasks", prompt);
  }
};
