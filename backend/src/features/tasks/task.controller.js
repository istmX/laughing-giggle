import * as taskService from "./task.service.js";

export const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.user._id, req.params.projectId, req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const getProjectTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getProjectTasks(req.user._id, req.params.projectId);
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.user._id, req.params.id);
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.user._id, req.params.id, req.body);
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        await taskService.deleteTask(req.user._id, req.params.id);
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
};
