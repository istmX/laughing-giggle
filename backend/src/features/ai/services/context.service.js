import { contextAgent } from "../agents/context.agent.js";
import AIGeneration from "../ai.model.js";

export const contextService = {
  async generateContext(ideaId, userId) {
    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });
    
    try {
      const result = await contextAgent.generateContext({ ideaId, userId });
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
