import { questionService } from "../services/question.service.js";

export const generateQuestions = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const result = await questionService.generateQuestions(ideaId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
