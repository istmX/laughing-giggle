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
      const { response, providerUsed, fallbackUsed, fallbackProvider } = await documentationAgent.generateDocumentation({ idea: ideaId });
      generation.status = "completed";
      generation.model = providerUsed;
      generation.metadata = { fallbackUsed, fallbackProvider };
      await generation.save();
      return response;
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  }
};
