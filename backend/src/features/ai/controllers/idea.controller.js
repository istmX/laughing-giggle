import { ideaService } from "../services/idea.service.js";

export const analyzeIdea = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const result = await ideaService.analyzeIdea(ideaId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
