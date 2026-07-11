import { aiDeveloperService } from "../services/developer.service.js";
import AppError from "../../../utils/AppError.js";

export const processDeveloperChat = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { prompt, history } = req.body;

    if (!prompt) {
      return next(new AppError("Prompt is required", 400));
    }

    const result = await aiDeveloperService.chat(projectId, userId, prompt, history);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
