import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";

export const generateRefinement = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const { answers, questions } = req.body;
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
      const qa_history = (questions || []).map(q => ({ question: q.question, answer: q.answer || "" }));
      const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_prompt: ideaDoc.prompt, qa_history })
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
