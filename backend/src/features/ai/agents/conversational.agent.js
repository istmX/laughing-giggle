import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildConversationalPrompt } from "../prompts/conversational.prompt.js";

export const conversationalAgent = {
  async processConversation(data) {
    const prompt = buildConversationalPrompt(data);
    return await orchestrator.execute("processConversation", prompt);
  }
};
