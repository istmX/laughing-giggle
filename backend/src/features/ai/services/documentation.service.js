import { documentationAgent } from "../agents/documentation.agent.js";
import AIGeneration from "../ai.model.js";

export const documentationService = {
  async generateDocumentation(ideaId, userId) {
    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });
    
    try {
      const result = await documentationAgent.generateDocumentation({ ideaId, userId });
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
