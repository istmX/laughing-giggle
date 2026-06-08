import Task from './task.model.js';
import Project from '../projects/project.model.js';
import { validateOwnership, validateId } from '../../utils/ownership.js';
import AppError from '../../utils/AppError.js';

export const createTask = async (userId, projectId, taskData) => {
  await validateOwnership(Project, projectId, userId, 'Project');

  const { title, description, priority } = taskData;
  if (!title) {
    throw new AppError('Task title is required', 400);
  }

  return await Task.create({
    project: projectId,
    title,
    description,
    priority
  });
};

export const getProjectTasks = async (userId, projectId) => {
  await validateOwnership(Project, projectId, userId, 'Project');
  return await Task.find({ project: projectId }).sort({ createdAt: -1 });
};

export const getTaskById = async (userId, taskId) => {
  validateId(taskId, 'task id');
  const task = await Task.findById(taskId).populate('project');
  
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.project.owner.toString() !== userId.toString()) {
    throw new AppError('Access denied', 403);
  }

  return task;
};

export const updateTask = async (userId, taskId, updateData) => {
  const task = await getTaskById(userId, taskId);

  const { title, description, priority, status, kanban_status } = updateData;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (kanban_status !== undefined) task.kanban_status = kanban_status;

  await task.save();
  return task;
};

export const deleteTask = async (userId, taskId) => {
  await getTaskById(userId, taskId);
  await Task.findByIdAndDelete(taskId);
};
