import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { aiRateLimiter } from "../../middleware/rateLimit.middleware.js";

import {
  analyzeIdea,
  generateQuestions,
  submitAnswers,
  generateContext,
  generateTasks
} from "./ai.controller.js";

const AIRouter = Router();

AIRouter.use(authMiddleware);
AIRouter.use(aiRateLimiter);

AIRouter.post(
  "/analyze/:ideaId",
  analyzeIdea
);

AIRouter.post(
  "/questions/:ideaId",
  generateQuestions
);

AIRouter.post(
  "/answers/:ideaId",
  submitAnswers
);

AIRouter.post(
  "/context/:ideaId",
  generateContext
);

AIRouter.post(
  "/tasks/:ideaId",
  generateTasks
);

export default AIRouter;