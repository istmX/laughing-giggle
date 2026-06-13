import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildQuestionPrompt } from "../prompts/question.prompt.js";

export const questionAgent = {
  async generateQuestions(data) {
    const prompt = buildQuestionPrompt(data);
    return await orchestrator.execute("generateQuestions", prompt);
  }
};
