import mongoose from "mongoose";
import Task from "./task.model.js";
import Project from "../../projects/project.model.js";

const validateTaskOwnership = async (taskId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return { error: { status: 400, message: "Invalid task id" } };
    }
    const task = await Task.findById(taskId).populate("project");
    if (!task) {
        return { error: { status: 404, message: "Task not found" } };
    }
    if (task.project.owner.toString() !== userId.toString()) {
        return { error: { status: 403, message: "Forbidden" } };
    }
    return { task };
};

export const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid project id" });
        }
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const { title, description, priority } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Task title is required" });
        }
        const task = await Task.create({ project: projectId, title, description, priority });
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid project id" });
        }
        const project = await Project.findOne({ _id: projectId, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const { task, error } = await validateTaskOwnership(id, req.user._id);
        if (error) return res.status(error.status).json({ message: error.message });
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { task, error } = await validateTaskOwnership(id, req.user._id);
        if (error) return res.status(error.status).json({ message: error.message });
        const { title, description, priority, status } = req.body;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;
        await task.save();
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await validateTaskOwnership(id, req.user._id);
        if (error) return res.status(error.status).json({ message: error.message });
        await Task.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error" });
    }
};
