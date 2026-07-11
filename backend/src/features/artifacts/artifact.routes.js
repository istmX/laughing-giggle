import express from "express";
import { getProjectArtifacts, updateArtifact, exportArtifactsZip } from "./artifact.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get("/project/:projectId", getProjectArtifacts);
router.put("/:artifactId", updateArtifact);
router.get("/project/:projectId/export", exportArtifactsZip);

export default router;
