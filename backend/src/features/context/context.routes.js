import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";

import {
  createContext,
  getContexts,
  getContextById,
  updateContext,
  deleteContext
} from "./context.controller.js";

const ContextRouter = Router();

ContextRouter.post("/", authMiddleware, createContext);
ContextRouter.get("/", authMiddleware, getContexts);
ContextRouter.get("/:id", authMiddleware, getContextById);
ContextRouter.patch("/:id", authMiddleware, updateContext);
ContextRouter.delete("/:id", authMiddleware, deleteContext);

export default ContextRouter;