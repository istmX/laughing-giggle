import { documentationService } from "../services/documentation.service.js";

export const generateDocumentation = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const result = await documentationService.generateDocumentation(ideaId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
