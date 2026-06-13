import orchestrator from "../orchestrator/ai.orchestrator.js";
import { buildRefinementPrompt } from "../prompts/refinement.prompt.js";

export const refinementAgent = {
  async refineSpecification(data) {
    const prompt = buildRefinementPrompt(data);
    return await orchestrator.execute("generateRefinedSpec", prompt);
  }
};
