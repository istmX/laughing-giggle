import { z } from "zod";

export const IdeaAnalysisSchema = z.object({
  is_complete: z.boolean(),
  missing_fields: z.array(z.string()),
  questions: z.array(
    z.object({
      key: z.string().min(1),
      question: z.string().min(1)
    })
  )
}).refine(data => data.is_complete || data.questions.length > 0, {
  message: "If the idea is not complete, questions must be provided.",
  path: ["questions"]
});
