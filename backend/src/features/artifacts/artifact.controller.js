import { artifactService } from "./artifact.service.js";
import AppError from "../../utils/AppError.js";

export const getProjectArtifacts = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const artifacts = await artifactService.getProjectArtifacts(projectId, userId);
    res.status(200).json(artifacts);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const updateArtifact = async (req, res, next) => {
  try {
    const { artifactId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    const artifact = await artifactService.updateArtifact(artifactId, userId, { content });
    res.status(200).json(artifact);
  } catch (error) {
    if (error.message === "Artifact not found") {
      next(new AppError(error.message, 404));
    } else {
      next(new AppError(error.message, 500));
    }
  }
};

export const exportArtifactsZip = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    await artifactService.exportArtifactsZip(projectId, userId, res);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
