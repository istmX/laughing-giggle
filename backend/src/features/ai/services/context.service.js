import { contextAgent } from "../agents/context.agent.js";
import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";
import Context from "../../context/context.model.js"; // Assume this is the correct path

export const contextService = {
  async generateContext(ideaId, userId) {
    const ideaDoc = await Idea.findById(ideaId);
    if (!ideaDoc) throw new Error("Idea not found");

    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });

    try {
      const result = await contextAgent.generateContext({ idea: ideaDoc.prompt, ideaId, userId });

      // Parse the JSON response
      const parsedContext = JSON.parse(result.response.content);

      // Create Context document
      const contextDoc = await Context.create({
        owner: userId,
        idea: ideaId,
        ...parsedContext
      });

      generation.status = "completed";
      generation.model = result.providerUsed;
      generation.metadata = { fallbackUsed: result.fallbackUsed, fallbackProvider: result.fallbackProvider };
      generation.generated_context = contextDoc._id; // Link to generation
      await generation.save();

      return parsedContext;
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  }
};
