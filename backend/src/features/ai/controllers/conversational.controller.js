import { conversationalService } from "../services/conversational.service.js";

export const processConversation = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const { history } = req.body;
    const userId = req.user.id;
    const result = await conversationalService.processConversation(ideaId, userId, history || []);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
