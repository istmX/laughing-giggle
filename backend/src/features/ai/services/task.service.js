import { taskAgent } from "../agents/task.agent.js";
import AIGeneration from "../ai.model.js";
import { validateTaskMission } from "../validators/task.validator.js";

export const taskService = {
  async generateTasks(ideaId, userId) {
    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });
    
    try {
      const { response, providerUsed, fallbackUsed, fallbackProvider } = await taskAgent.generateTasks({ ideaId, userId });
      
      // Validate mission output (assuming response is array of missions for now)
      const validatedMissions = [];
      for (const mission of response) {
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
