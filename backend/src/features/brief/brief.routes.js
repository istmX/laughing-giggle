import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware.js";

import {
    createBrief,
    getBriefs,
    getBriefById,
    updateBrief,
    deleteBrief
} from "./brief.controller.js";

const BriefRouter = Router();

BriefRouter.post("/", authMiddleware, createBrief);
BriefRouter.get("/", authMiddleware, getBriefs);
BriefRouter.get("/:id", authMiddleware, getBriefById);
BriefRouter.patch("/:id", authMiddleware, updateBrief);
BriefRouter.delete("/:id", authMiddleware, deleteBrief);

export default BriefRouter;