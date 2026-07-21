import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";

export const generateQuestions = async (req, res, next) => {
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
      const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: ideaDoc.prompt, idea_id: ideaId })
      });
      
      if (!response.ok) throw new Error("Failed to fetch from python service");
      
      const result = await response.json();
      
      generation.status = "completed";
      generation.model = result.providerUsed || "python-service";
      generation.metadata = { fallbackUsed: result.fallbackUsed, fallbackProvider: result.fallbackProvider };
      await generation.save();
      
      res.status(200).json(result.response || result);
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
