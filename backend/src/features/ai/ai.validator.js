import { z } from "zod";

export const IdeaAnalysisSchema = z.object({
  is_complete: z.boolean(),
  missing_fields: z.array(z.string()),
  questions: z.array(
    z.object({
      key: z.string(),
      question: z.string()
    })
  )
});