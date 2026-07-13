import { adminService } from './admin.service.js';
import AppError from '../../utils/AppError.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.params.userId, req.body);
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await adminService.getAllProjects();
    res.status(200).json({ projects });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ stats });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await adminService.deleteProject(req.params.projectId);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
