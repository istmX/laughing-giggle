import AppError from "../../../utils/AppError.js";
import Project from "../../projects/project.model.js";
import { artifactService } from "../../artifacts/artifact.service.js";
import fs from "fs";
import path from "path";

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

    let contextFiles = [];
    try {
      // Assuming cwd is backend/
      const contextDir = path.resolve(process.cwd(), "../RAG_Service/context-engine/app/knowledge/context");
      contextFiles = fs.readdirSync(contextDir).filter(f => f.endsWith(".md"));
    } catch (e) {
      console.error("Failed to read context directory:", e);
      contextFiles = [
        "architecture.md",
        "build-plan.md",
        "code-standerds.md",
        "libarary-docs.md",
        "progress-tracker.md",
        "project-overviwe.md",
        "ui-registy.md",
        "ui-rules.md",
        "ui-tokens.md"
      ];
    }

    const initialFiles = [
      "AGENTS.md",
      "TASKS.md",
      ...contextFiles
    ];
    for (const file of initialFiles) {
      await artifactService.createOrUpdateArtifact(projectId, userId, file, "", "markdown");
    }
    const artifacts = await artifactService.getProjectArtifacts(projectId, userId);
    return res.status(200).json(artifacts);
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

    let reference_template = "";
    try {
      const basePath = path.resolve(process.cwd(), "../RAG_Service/context-engine/app/knowledge");
      if (file_path === "AGENTS.md") {
        reference_template = fs.readFileSync(path.join(basePath, "Agents.md"), "utf8");
      } else if (file_path !== "TASKS.md") {
        reference_template = fs.readFileSync(path.join(basePath, "context", file_path), "utf8");
      }
    } catch (e) {
      console.warn("Could not load reference template for", file_path);
    }

    const response = await fetch(process.env.PYTHON_SERVICE_URL + "/api/orchestrate/artifact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        project_id: projectId,
        target_file_path: file_path, 
        refined_spec: project.wizard_state.refinedSpec,
        reference_template: reference_template
      })
    });
    
    if (!response.ok) throw new Error("Failed to fetch from python service");
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let finalContent = "";
    
    while(true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) finalContent = data.content;
          } catch(e) {}
        }
      }
    }
    
    let content = finalContent;
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

    res.status(500).json({ error: "Failed to generate artifact" });
  } catch (error) {
    next(error);
  }
};
