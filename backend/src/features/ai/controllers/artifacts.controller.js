import { aiArtifactsService } from "../services/artifacts.service.js";
import AppError from "../../../utils/AppError.js";

export const generateArtifacts = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const { projectId } = req.body;

    if (!projectId) {
      return next(new AppError("projectId is required", 400));
    }

    const result = await aiArtifactsService.generateArtifacts(ideaId, projectId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
