import { contextService } from "../services/context.service.js";

export const generateContext = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const result = await contextService.generateContext(ideaId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
