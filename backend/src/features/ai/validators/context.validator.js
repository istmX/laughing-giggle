import { z } from "zod";

const stringOrRecord = z.union([z.string(), z.record(z.any())]).default("");

export const contextSchema = z.object({
  project_overview: stringOrRecord,
  build_plan: stringOrRecord,
  architecture: stringOrRecord,
  mermaid_diagram: stringOrRecord,
  code_standards: stringOrRecord,
  library_docs: stringOrRecord,
  progress_tracker: stringOrRecord,
  ui_rules: stringOrRecord,
  ui_tokens: stringOrRecord,
  ui_registry: stringOrRecord,
  agents: stringOrRecord,
  readme: stringOrRecord,
}).passthrough();

export const validateContext = (data) => {
  return contextSchema.safeParse(data);
};
