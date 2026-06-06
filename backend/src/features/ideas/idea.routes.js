import { Router } from "express";

import {
    createIdea,
    getIdeas,
    getIdeaById,
    updateIdea,
    deleteIdea
} from "./idea.controller.js";

import { authMiddleware } from "../auth/auth.middleware.js";

const IdeaRouter = Router();

IdeaRouter.post("/", authMiddleware, createIdea);
IdeaRouter.get("/", authMiddleware, getIdeas);
IdeaRouter.get("/:id", authMiddleware, getIdeaById);
IdeaRouter.patch("/:id", authMiddleware, updateIdea);
IdeaRouter.delete("/:id", authMiddleware, deleteIdea);

export default IdeaRouter;