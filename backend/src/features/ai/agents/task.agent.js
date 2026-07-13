import { executeWithFallback } from "../graphs/fallback_chain.js";
import { buildTaskPrompt } from "../prompts/task.prompt.js";

export const taskAgent = {
  async generateTasks(data) {
    const prompt = buildTaskPrompt(data);
    return await executeWithFallback(prompt);
  }
};
