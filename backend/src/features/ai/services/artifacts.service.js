import orchestrator from "../orchestrator/ai.orchestrator.js";
import Brief from "../../brief/brief.model.js";
import { artifactService } from "../../artifacts/artifact.service.js";

export const aiArtifactsService = {
  async generateArtifacts(ideaId, projectId, userId) {
    const brief = await Brief.findOne({ idea: ideaId, owner: userId });
    if (!brief) throw new Error("Brief not found. Complete the conversation first.");

    // Read reference files from data folder to use as examples
    const fs = await import("fs/promises");
    const path = await import("path");
    const dataDir = path.join(process.cwd(), "src/features/ai/data");
    
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
    const contextTemplates = await readDirAsText(path.join(dataDir, "context"));
    const uiKnowledge = await readDirAsText(path.join(dataDir, "ui"));

    // Construct the prompt describing the artifacts needed
    const prompt = `
You are an expert Software Architect and Developer.
We are building an application with the following context:

Platform: ${brief.platform}
Frontend Stack: ${brief.frontend_stack}
Backend Stack: ${brief.backend_stack}
Database: ${brief.database}
UI Style: ${brief.ui_style}
Application Type: ${brief.application_type}
Target Users: ${brief.target_users}

Based on the conversation history:
${JSON.stringify(brief.questions)}

Please generate the following documentation files for this project. Format your response strictly as a JSON object containing a "files" array. Each object in the array must have "path" and "content".

Required files to generate:
1. "AGENTS.md" (Instructions for AI agents on how to build this project)
2. "context/project-overview.md"
3. "context/architecture.md"
4. "context/ui-tokens.md" (Use the chosen UI style to pick beautiful, non-generic hex colors)
5. "context/ui-rules.md"
6. "context/ui-registry.md"
7. "context/build-plan.md" (Detailed phase-by-step plan)
8. "context/code-standards.md"
9. "context/library-docs.md"
10. "TASKS.md" (A list of actionable prompts for agents)
11. "PROGRESS.md" (Should be created but left mostly empty with a skeleton structure)

IMPORTANT INSTRUCTIONS:
- Generate files that are highly detailed, with the **same length and depth** of content as the ScribbleBox examples provided below.
- If the user has already given specific color palettes and a theme, DO NOT change them.
- If the user said "AI decide" or left the theme vague, you MUST use the UI design knowledge provided below to make excellent, modern design decisions instead of using generic themes like "purple".

--- REFERENCE UI KNOWLEDGE FOR GOOD DECISIONS ---
${uiKnowledge}

--- EXAMPLES OF HIGH-QUALITY FILES (ScribbleBox Reference) ---
Example of Agents.md:
${agentsTemplate}

Examples of Context files:
${contextTemplates}
------------------------------------------------

Do not wrap the JSON in Markdown backticks. Return valid JSON only.

Schema:
{
  "files": [
    {
      "path": "AGENTS.md",
      "content": "# Agents\\n..."
    }
  ]
}
`;

    const systemPrompt = "You are a JSON-generating expert architect agent. Only output valid JSON matching the schema.";
    
    // Call the orchestrator
    const aiResponse = await orchestrator.execute("generateArtifacts", `${prompt}\n\n${systemPrompt}`);
    
    let parsedResult;
    try {
      // The orchestrator returns { content: "...", providerUsed: "..." }
      const content = aiResponse.content;
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
