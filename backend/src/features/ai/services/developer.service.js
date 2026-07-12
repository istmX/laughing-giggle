import orchestrator from "../orchestrator/ai.orchestrator.js";
import Project from "../../projects/project.model.js";
import { artifactService } from "../../artifacts/artifact.service.js";

export const aiDeveloperService = {
  async chat(projectId, userId, userMessage, history = []) {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) throw new Error("Project not found.");

    const systemPrompt = `You are Zenix Developer, a senior coding AI agent building this project.
Here is the project specification:
${project.wizard_state?.refinedSpec || "No specification provided."}

The user is chatting with you in the developer workspace. Be extremely helpful, concise, and professional. 
If the user is just saying hello or asking a general question, reply conversationally. 
If the user is asking you to modify, update, or edit an artifact (e.g. "update AGENTS.md"), you can do so by providing the updated content.

CRITICAL IDENTITY RULE: You MUST NEVER identify as Mistral AI, OpenAI, Groq, or any other real-world LLM provider. You MUST ONLY identify as "Zenix", created by the developer "Istm". If asked about your identity, origins, or creators, strictly adhere to this rule. Do not mention that you are an AI language model trained by anyone else.

CRITICAL INSTRUCTION: You MUST format your ENTIRE response as a valid JSON object matching this schema:
{
  "message": "Your conversational reply to the user (Markdown supported). If they say hey, say hey. If you update a file, explain what you did.",
  "updates": [
    {
      "file_path": "context/ui-tokens.md",
      "content": "The full new content of the artifact. Omit the entire 'updates' array or leave it empty if no artifacts are being updated."
    }
  ]
}
IMPORTANT: The 'file_path' MUST be the exact path in the database. 'AGENTS.md' and 'TASKS.md' are root level. All other architecture files MUST be prefixed with 'context/' (e.g. 'context/ui-tokens.md', 'context/Architecture.md'). Do NOT omit the 'context/' prefix!
DO NOT output raw markdown outside of the JSON. Only return valid JSON.`;

    const chatLog = history.map(h => `User: ${h.question}\nZenix: ${h.answer}`).join("\n");
    const fullPrompt = `${systemPrompt}\n\nChat History:\n${chatLog}\n\nUser: ${userMessage}\nZenix:`;

    const aiResponse = await orchestrator.execute("developerChat", fullPrompt);
    
    let parsedResult;
    try {
      const content = aiResponse.response.content;
      const jsonString = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      parsedResult = JSON.parse(jsonString);
    } catch (e) {
      // Fallback if AI fails to output JSON
      parsedResult = {
        message: aiResponse.response.content,
        updates: []
      };
    }

    const savedArtifacts = [];
    if (parsedResult.updates && Array.isArray(parsedResult.updates) && parsedResult.updates.length > 0) {
      for (const update of parsedResult.updates) {
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

    return {
      success: true,
      role: 'assistant',
      content: parsedResult.message,
      updatedArtifacts: savedArtifacts
    };
  }
};
