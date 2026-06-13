import { documentationAgent } from "../agents/documentation.agent.js";
import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";

export const documentationService = {
  async generateDocumentation(ideaId, userId) {
    const ideaDoc = await Idea.findById(ideaId);
    if (!ideaDoc) throw new Error("Idea not found");

    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });
    
    try {
      const result = await documentationAgent.generateDocumentation({ idea: ideaDoc.prompt, ideaId, userId });
      generation.status = "completed";
      generation.model = result.providerUsed;
      generation.metadata = { fallbackUsed: result.fallbackUsed, fallbackProvider: result.fallbackProvider };
      await generation.save();
      return result.response;
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  }
};
