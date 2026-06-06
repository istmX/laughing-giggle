import { Router } from "express";

import { createTask, getProjectTasks, getTaskById, deleteTask, updateTask } from "./task.controller.js";
import { authMiddleware } from "../auth.middleware.js";

const TaskRouter = Router();

TaskRouter.post("/project/:projectId", authMiddleware, createTask);
TaskRouter.get("/project/:projectId", authMiddleware, getProjectTasks);
TaskRouter.get("/:id", authMiddleware, getTaskById);
TaskRouter.delete("/:id", authMiddleware, deleteTask);
TaskRouter.patch("/:id", authMiddleware, updateTask);

export default TaskRouter;

