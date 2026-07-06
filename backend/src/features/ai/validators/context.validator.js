import { z } from "zod";

export const contextSchema = z.object({
  project_overview: z.record(z.any()).default({}),
  build_plan: z.record(z.any()).default({}),
  architecture: z.record(z.any()).default({}),
  mermaid_diagram: z.record(z.any()).default({}),
  code_standards: z.record(z.any()).default({}),
  library_docs: z.record(z.any()).default({}),
  progress_tracker: z.record(z.any()).default({}),
  ui_rules: z.record(z.any()).default({}),
  ui_tokens: z.record(z.any()).default({}),
  ui_registry: z.record(z.any()).default({}),
  agents: z.record(z.any()).default({}),
  readme: z.record(z.any()).default({}),
}).passthrough(); // Allow unknown keys if the AI returns more

export const validateContext = (data) => {
  return contextSchema.safeParse(data);
};
