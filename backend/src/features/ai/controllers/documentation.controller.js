import AIGeneration from "../ai.model.js";
import Idea from "../../ideas/idea.model.js";
import Project from "../../projects/project.model.js";

export const generateDocumentation = async (req, res, next) => {
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
      const project = await Project.findOne({ idea: ideaId });
      const refinedSpec = project && project.wizard_state ? project.wizard_state.refinedSpec : "";

      const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/documentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: project ? project._id.toString() : ideaId, refined_spec: refinedSpec, rag_context: "" })
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
