import { executeWithFallback } from "../graphs/fallback_chain.js";
import { buildConversationalPrompt } from "../prompts/conversational.prompt.js";

export const conversationalAgent = {
  async processConversation(data) {
    const prompt = buildConversationalPrompt(data);
    return await executeWithFallback(prompt);
  }
};
