import { questionAgent } from "../agents/question.agent.js";
import AIGeneration from "../ai.model.js";

export const questionService = {
  async generateQuestions(ideaId, userId) {
    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });
    
    try {
      const result = await questionAgent.generateQuestions({ ideaId, userId });
      generation.status = "completed";
      await generation.save();
      return result;
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  }
};
