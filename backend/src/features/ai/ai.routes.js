import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";

import {
  analyzeIdea,
  generateQuestions,
  submitAnswers,
  generateContext
} from "./ai.controller.js";

const AIRouter = Router();

AIRouter.post(
  "/analyze/:ideaId",
  authMiddleware,
  analyzeIdea
);

AIRouter.post(
  "/questions/:ideaId",
  authMiddleware,
  generateQuestions
);

AIRouter.post(
  "/answers/:ideaId",
  authMiddleware,
  submitAnswers
);

AIRouter.post(
  "/context/:ideaId",
  authMiddleware,
  generateContext
);

export default AIRouter;