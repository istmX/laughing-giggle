import { executeWithFallback } from "../graphs/fallback_chain.js";
import { buildRefinementPrompt } from "../prompts/refinement.prompt.js";

export const refinementAgent = {
  async refineSpecification(data) {
    const prompt = buildRefinementPrompt(data);
    return await executeWithFallback(prompt);
  }
};
