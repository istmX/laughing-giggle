import { taskService } from "../services/task.service.js";

export const generateTasks = async (req, res, next) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    const result = await taskService.generateTasks(ideaId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
