import { z } from "zod";

export const taskMissionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  ai_prompt: z.string().min(1),
  required_context: z.array(z.string()),
  implementation_steps: z.array(z.string()),
  expected_files: z.array(z.string()),
  success_criteria: z.array(z.string()),
  complexity: z.enum(["Low", "Medium", "High"]),
});

export const validateTaskMission = (data) => {
  return taskMissionSchema.safeParse(data);
};
