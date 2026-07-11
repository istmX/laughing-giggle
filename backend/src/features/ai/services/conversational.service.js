import { conversationalAgent } from "../agents/conversational.agent.js";
import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";
import Brief from "../../brief/brief.model.js";

export const conversationalService = {
  async processConversation(ideaId, userId, history) {
    const ideaDoc = await Idea.findById(ideaId);
    if (!ideaDoc) throw new Error("Idea not found");

    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });
    
    try {
      const result = await conversationalAgent.processConversation({
        idea: ideaDoc.prompt,
        history,
        ideaId,
        userId
      });
      
      generation.status = "completed";
      generation.model = result.providerUsed;
      generation.metadata = { fallbackUsed: result.fallbackUsed, fallbackProvider: result.fallbackProvider };
      await generation.save();

      // Find or create Brief to save the AI-generated questions and answers
      let brief = await Brief.findOne({ idea: ideaId, owner: userId });
      if (!brief) {
        brief = new Brief({
          owner: userId,
          idea: ideaId,
        });
      }

      // Map Q&A history to answers object
      brief.answers = (history || []).reduce((acc, item) => {
        if (item.question && item.answer !== undefined) {
          acc[item.question] = item.answer;
        }
        return acc;
      }, {});

      if (result.response && result.response.is_complete) {
        brief.is_complete = true;
      }

      await brief.save();
      
      return result.response;
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  }
};
