import AppError from "../../../utils/AppError.js";
import Project from "../../projects/project.model.js";
import { artifactService } from "../../artifacts/artifact.service.js";

export const generateArtifacts = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const { projectId } = req.body;

    if (!projectId) {
      return next(new AppError("projectId is required", 400));
    }
    
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project || !project.wizard_state || !project.wizard_state.refinedSpec) {
      return next(new AppError("Project not found or specification not finalized.", 400));
    }

    const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/artifact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "generate_all",
        ideaId, 
        projectId, 
        userId, 
        refinedSpec: project.wizard_state.refinedSpec 
      })
    });
    
    if (!response.ok) throw new Error("Failed to fetch from python service");
    
    const result = await response.json();
    
    // We assume python service gives us a list of artifacts or we just generate pending ones
    // But since the python side streams or returns data, we'll let it do the logic or mimic it
    // Wait, the prompt says "artifacts.controller.js -> POST /api/orchestrate/artifact (handles SSE streaming if the Python side streams, otherwise just return the data)"
    // Let's just return the JSON data from Python. 
    // And wait, the old aiArtifactsService logic created placeholder artifacts and returned them for `generateArtifacts`. 
    // If the python proxy returns them, we return the result.
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const generateSingleArtifact = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { file_path } = req.body;

    if (!file_path) {
      return next(new AppError("file_path is required", 400));
    }

    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project || !project.wizard_state || !project.wizard_state.refinedSpec) {
      return next(new AppError("Project not found or specification not finalized.", 400));
    }

    const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/artifact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "generate_single",
        projectId, 
        userId, 
        file_path, 
        refinedSpec: project.wizard_state.refinedSpec 
      })
    });
    
    if (!response.ok) throw new Error("Failed to fetch from python service");
    
    const result = await response.json();
    
    // If the python service doesn't save to the DB, we save it here.
    // The previous service saved the artifact.
    let content = result.content || result.response;
    if (content) {
      if (content.startsWith("\`\`\`markdown") && content.endsWith("\`\`\`")) {
        content = content.substring(13, content.length - 3).trim();
      } else if (content.startsWith("\`\`\`") && content.endsWith("\`\`\`")) {
        content = content.substring(3, content.length - 3).trim();
      }

      const artifact = await artifactService.createOrUpdateArtifact(
        projectId,
        userId,
        file_path,
        content,
        "markdown"
      );
      
      return res.status(200).json({ success: true, artifact });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
