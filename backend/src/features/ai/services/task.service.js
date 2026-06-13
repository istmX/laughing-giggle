import { taskAgent } from "../agents/task.agent.js";
import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";
import { validateTaskMission } from "../validators/task.validator.js";

export const taskService = {
  async generateTasks(ideaId, userId) {
    const ideaDoc = await Idea.findById(ideaId);
    if (!ideaDoc) throw new Error("Idea not found");

    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });
    
    try {
      const result = await taskAgent.generateTasks({ idea: ideaDoc.prompt, ideaId, userId });
      const { response, providerUsed, fallbackUsed, fallbackProvider } = result;
      
      // Validate mission output
      const validatedMissions = [];
      // Assuming response might be a string (from AI) that needs parsing, or already array
      let tasks = Array.isArray(response) ? response : JSON.parse(response);
      
      if (!Array.isArray(tasks)) throw new Error("Expected response to be an array");

      for (const mission of tasks) {
        const validation = validateTaskMission(mission);
        if (!validation.success) throw new Error(`Validation failed: ${validation.error.message}`);
        validatedMissions.push(validation.data);
      }

      generation.status = "completed";
      generation.model = providerUsed;
      generation.metadata = { fallbackUsed, fallbackProvider };
      await generation.save();
      
      return validatedMissions;
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  }
};
