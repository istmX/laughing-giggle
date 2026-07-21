import AppError from "../../../utils/AppError.js";
import Project from "../../projects/project.model.js";
import { artifactService } from "../../artifacts/artifact.service.js";

export const processDeveloperChat = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { prompt, history } = req.body;

    if (!prompt) {
      return next(new AppError("Prompt is required", 400));
    }

    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) return next(new AppError("Project not found.", 404));

    const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/developer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user_message: prompt, 
        chat_history: history || [], 
        refined_spec: project.wizard_state?.refinedSpec || "" 
      })
    });
    
    if (!response.ok) throw new Error("Failed to fetch from python service");
    
    const result = await response.json();
    
    const savedArtifacts = [];
    if (result.updates && Array.isArray(result.updates) && result.updates.length > 0) {
      for (const update of result.updates) {
        if (update.file_path && update.content) {
          const artifact = await artifactService.createOrUpdateArtifact(
            projectId,
            userId,
            update.file_path,
            update.content,
            "markdown"
          );
          savedArtifacts.push(artifact);
        }
      }
    }
    
    res.status(200).json({
      success: true,
      role: 'assistant',
      content: result.message || result.content,
      updatedArtifacts: savedArtifacts
    });
  } catch (error) {
    next(error);
  }
};
