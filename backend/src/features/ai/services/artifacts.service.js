import { executeWithFallback } from "../graphs/fallback_chain.js";
import Project from "../../projects/project.model.js";
import { artifactService } from "../../artifacts/artifact.service.js";
import fs from "fs/promises";
import path from "path";

export const aiArtifactsService = {
  async generateArtifacts(ideaId, projectId, userId) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project || !project.wizard_state || !project.wizard_state.refinedSpec) {
      throw new Error("Project not found or specification not finalized.");
    }

    const dataDir = path.join(process.cwd(), "src/features/ai/data");
    const contextDir = path.join(dataDir, "context");
    
    let contextFiles = [];
    try {
      contextFiles = (await fs.readdir(contextDir)).filter(f => f.endsWith(".md"));
    } catch (e) {}

    const requiredFilesList = [
      { path: "AGENTS.md" },
      ...contextFiles.map(file => ({ path: `context/${file}` })),
      { path: "TASKS.md" }
    ];

    const savedArtifacts = [];
    for (const file of requiredFilesList) {
      const artifact = await artifactService.createOrUpdateArtifact(
        projectId,
        userId,
        file.path,
        "Pending generation...",
        "markdown"
      );
      savedArtifacts.push(artifact);
    }

    return { success: true, artifacts: savedArtifacts };
  },

  async generateSingleArtifact(projectId, userId, filePath) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project || !project.wizard_state || !project.wizard_state.refinedSpec) {
      throw new Error("Project not found or specification not finalized.");
    }

    const dataDir = path.join(process.cwd(), "src/features/ai/data");
    let templatePath = "";
    
    if (filePath === "AGENTS.md") templatePath = path.join(dataDir, "Agents.md");
    else if (filePath === "TASKS.md") templatePath = ""; // Add tasks template if available
    else templatePath = path.join(dataDir, filePath); 

    let templateContent = "";
    try {
      if (templatePath) templateContent = await fs.readFile(templatePath, "utf-8");
    } catch (e) {}

    const uiKnowledgeDir = path.join(dataDir, "ui");
    let uiKnowledge = "";
    try {
      const files = await fs.readdir(uiKnowledgeDir);
      for (const file of files) {
        if (file.endsWith(".md")) {
          const fileContent = await fs.readFile(path.join(uiKnowledgeDir, file), "utf-8");
          uiKnowledge += `\n--- UI Knowledge: ${file} ---\n${fileContent}\n`;
        }
      }
    } catch (e) {}

    const prompt = `
You are an expert Software Architect and Developer.
We are building an application based on the following finalized specification:

${project.wizard_state.refinedSpec}

Your ONLY task is to generate the exact contents for the file: "${filePath}".
You MUST NOT generate any other files. Do not wrap your response in JSON. Output raw markdown.

CRITICAL INSTRUCTIONS:
1. If the file is AGENTS.md, it MUST NOT be a generic task board. It MUST be a strict "Agent Instruction Manual" with hard UX rules and operational directives.
2. If the user has already given specific color palettes and a theme, DO NOT change them. If they left it vague, use the UI knowledge below to make excellent design decisions.
3. Your generated file MUST strictly follow the exact format, style, and opinionated tone of the reference template provided. Do not deviate from its structure.

--- REFERENCE UI KNOWLEDGE ---
${uiKnowledge}

--- REFERENCE TEMPLATE FOR ${filePath} ---
${templateContent ? templateContent : "(No explicit template provided. Format as a professional technical markdown document suitable for AI coding agents to follow.)"}
------------------------------------------------

Please generate the full, detailed markdown content for ${filePath} now:
`;

    const aiResponse = await executeWithFallback(prompt);
    let content = aiResponse.response;
    
    // Cleanup potential markdown codeblock wrapping around the whole response
    if (content.startsWith("\`\`\`markdown") && content.endsWith("\`\`\`")) {
      content = content.substring(13, content.length - 3).trim();
    } else if (content.startsWith("\`\`\`") && content.endsWith("\`\`\`")) {
      content = content.substring(3, content.length - 3).trim();
    }

    const artifact = await artifactService.createOrUpdateArtifact(
      projectId,
      userId,
      filePath,
      content,
      "markdown"
    );

    return { success: true, artifact };
  }
};
