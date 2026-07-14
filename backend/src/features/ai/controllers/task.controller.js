import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";
import { validateTaskMission } from "../validators/task.validator.js";

export const generateTasks = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;

    const ideaDoc = await Idea.findById(ideaId);
    if (!ideaDoc) return res.status(404).json({ error: "Idea not found" });

    const generation = await AIGeneration.create({
      owner: userId,
      idea: ideaId,
      status: "processing",
      generation_hash: "hash-" + Date.now(),
    });

    try {
      const resp = await fetch("http://127.0.0.1:8000/api/orchestrate/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: ideaDoc.prompt, ideaId, userId })
      });
      
      if (!resp.ok) throw new Error("Failed to fetch from python service");
      
      const result = await resp.json();
      const { response, providerUsed, fallbackUsed, fallbackProvider } = result;
      
      const validatedMissions = [];
      let tasks = Array.isArray(response) ? response : (typeof response === 'string' ? JSON.parse(response) : response);
      
      if (!Array.isArray(tasks)) tasks = [tasks]; // Try to salvage if not array

      for (const mission of tasks) {
        const validation = validateTaskMission(mission);
        if (!validation.success) throw new Error(`Validation failed: ${validation.error.message}`);
        validatedMissions.push(validation.data);
      }

      generation.status = "completed";
      generation.model = providerUsed || "python-service";
      generation.metadata = { fallbackUsed, fallbackProvider };
      await generation.save();
      
      res.status(200).json(validatedMissions);
    } catch (error) {
      generation.status = "failed";
      generation.error_message = error.message;
      await generation.save();
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
