import { executeWithFallback } from "../graphs/fallback_chain.js";
import { buildQuestionPrompt } from "../prompts/question.prompt.js";

export const questionAgent = {
  async generateQuestions(data) {
    if (!data || typeof data.idea !== 'string' || data.idea.trim() === '') {
      throw new Error('Invalid input: data.idea must be a non-empty string');
    }
    const prompt = buildQuestionPrompt(data);
    return await executeWithFallback(prompt);
  }
};
