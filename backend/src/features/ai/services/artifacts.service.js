import orchestrator from "../orchestrator/ai.orchestrator.js";
import Project from "../../projects/project.model.js";
import { artifactService } from "../../artifacts/artifact.service.js";

export const aiArtifactsService = {
  async generateArtifacts(ideaId, projectId, userId) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project || !project.wizard_state || !project.wizard_state.refinedSpec) {
      throw new Error("Project not found or specification not finalized.");
    }

    const fs = await import("fs/promises");
    const path = await import("path");
    const dataDir = path.join(process.cwd(), "src/features/ai/data");
    const contextDir = path.join(dataDir, "context");
    
    let contextFiles = [];
    try {
      contextFiles = (await fs.readdir(contextDir)).filter(f => f.endsWith(".md"));
    } catch (e) {}

    const readDirAsText = async (dirPath) => {
      let content = "";
      try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
          if (file.endsWith(".md")) {
            const fileContent = await fs.readFile(path.join(dirPath, file), "utf-8");
            content += `\n--- Example: ${file} ---\n${fileContent}\n`;
          }
        }
      } catch (e) {
        // Directory might not exist or failed to read
      }
      return content;
    };

    const agentsTemplate = await fs.readFile(path.join(dataDir, "Agents.md"), "utf-8").catch(() => "");
    const contextTemplates = await readDirAsText(contextDir);
    const uiKnowledge = await readDirAsText(path.join(dataDir, "ui"));

    // Dynamically build required files and schema to ensure everything is generated
    const requiredFilesList = [
      `1. "AGENTS.md" (Instructions for AI agents on how to build this project)`
    ];
    const schemaFiles = [
      { path: "AGENTS.md", content: "# Agents\n..." }
    ];
    
    contextFiles.forEach((file, index) => {
      requiredFilesList.push(`${index + 2}. "context/${file}"`);
      schemaFiles.push({ path: `context/${file}`, content: "..." });
    });
    
    // Add TASKS.md as the final required file
    requiredFilesList.push(`${contextFiles.length + 2}. "TASKS.md" (Actionable prompts for agents)`);
    schemaFiles.push({ path: "TASKS.md", content: "# Tasks\n..." });

    const requiredFilesText = requiredFilesList.join("\n");
    const schemaText = JSON.stringify({ files: schemaFiles }, null, 2);

    // Construct the prompt describing the artifacts needed
    const prompt = `
You are an expert Software Architect and Developer.
We are building an application based on the following finalized specification:

${project.wizard_state.refinedSpec}

Please generate the following documentation files for this project. Format your response strictly as a JSON object containing a "files" array. Each object in the array must have "path" and "content".

Required files to generate:
${requiredFilesText}

IMPORTANT INSTRUCTIONS:
1. "AGENTS.md" MUST NOT be a generic task board or architecture summary. It MUST be a strict "Agent Instruction Manual".
   - It MUST include a strong "What this IS vs What this is NOT" philosophy section.
   - It MUST include specific emotional design guardrails ("The product should feel X").
   - It MUST include strict operational rules (e.g., "Before making decisions, read X...", "Whenever work is completed, update Y...").
   - It MUST include hard UX/UI rules (e.g., "Empty states must have X, Y, Z").
   - It MUST include a numbered priority list (e.g., 1. UX, 2. Design, 3. Performance).
   - If you do not include these specific behavioral guardrails, the agents will fail.
2. If the user has already given specific color palettes and a theme, DO NOT change them.
3. If the user said "AI decide" or left the theme vague, you MUST use the UI design knowledge provided below to make excellent, modern design decisions.
4. CRITICAL: Your generated files MUST strictly follow the exact format, style, and opinionated tone of their respective examples.

--- REFERENCE UI KNOWLEDGE FOR GOOD DECISIONS ---
${uiKnowledge}

--- EXAMPLES OF HIGH-QUALITY FILES ---
Example of Agents.md (USE THIS AS A STRICT REFERENCE FOR YOUR AGENTS.md OUTPUT):
${agentsTemplate}

Examples of Context files (Match their tone and structure):
${contextTemplates}
------------------------------------------------

Do not wrap the JSON in Markdown backticks. Return valid JSON only.

Schema:
${schemaText}
`;

    const systemPrompt = "You are a JSON-generating expert architect agent. Only output valid JSON matching the schema.";
    
    // Call the orchestrator
    const aiResponse = await orchestrator.execute("generateArtifacts", `${prompt}\n\n${systemPrompt}`);
    
    let parsedResult;
    try {
      // The orchestrator returns { response: { content: "..." }, providerUsed: "..." }
      const content = aiResponse.response.content;
      // Strip markdown code blocks if the AI accidentally adds them around the JSON
      const jsonString = content.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      parsedResult = JSON.parse(jsonString);
    } catch (e) {
      throw new Error("AI did not return valid JSON for artifacts.");
    }

    if (!parsedResult.files || !Array.isArray(parsedResult.files)) {
      throw new Error("AI did not return a valid 'files' array.");
    }

    // Save each artifact to the database
    const savedArtifacts = [];
    for (const file of parsedResult.files) {
      if (file.path && file.content) {
        const artifact = await artifactService.createOrUpdateArtifact(
          projectId,
          userId,
          file.path,
          file.content,
          "markdown"
        );
        savedArtifacts.push(artifact);
      }
    }

    return { success: true, artifacts: savedArtifacts };
  }
};
