import * as projectService from './project.service.js';

export const createProject = async (req, res, next) => {
  try {
    const newProject = await projectService.createProject(req.user._id, req.body);

    res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjects(req.user._id);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.user._id, req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    next(error);
  }
};


