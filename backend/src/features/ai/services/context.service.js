import { contextAgent } from "../agents/context.agent.js";
import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";
import Context from "../../context/context.model.js"; // Assume this is the correct path
import { validateContext } from "../validators/context.validator.js";

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

    let contextDoc = null; // Initialize contextDoc outside try for wider scope

    try {
      const result = await contextAgent.generateContext({ idea: ideaDoc.prompt, ideaId, userId });

      // Parse the JSON response
      const parsedContext = JSON.parse(result.response.content);

      // Validate parsedContext
      const validationResult = validateContext(parsedContext);
      if (!validationResult.success) {
        throw new Error(`Context validation failed: ${validationResult.error.message}`);
      }
      const validatedContext = validationResult.data;

      // Create Context document
      contextDoc = await Context.create({
        owner: userId,
        idea: ideaId,
        ...validatedContext,
      });

      generation.status = "completed";
      generation.model = result.providerUsed;
      generation.metadata = { fallbackUsed: result.fallbackUsed, fallbackProvider: result.fallbackProvider };
      generation.generated_context = contextDoc._id; // Link to generation
      await generation.save();

      return validatedContext;
    } catch (error) {
      // If Context was created but generation.save() failed, delete the Context
      if (contextDoc) {
        await Context.deleteOne({ _id: contextDoc._id });
      }
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  }
};

