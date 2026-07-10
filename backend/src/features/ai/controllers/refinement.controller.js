import { refinementService } from "../services/refinement.service.js";

export const generateRefinement = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const { answers, questions } = req.body;
    const userId = req.user.id;
    const result = await refinementService.refineSpecification(ideaId, userId, answers, questions);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
