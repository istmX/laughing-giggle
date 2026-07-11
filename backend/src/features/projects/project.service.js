import Project from './project.model.js';
import Task from '../tasks/task.model.js';
import Context from '../context/context.model.js';
import Idea from '../ideas/idea.model.js';
import Brief from '../brief/brief.model.js';
import AIGeneration from '../ai/ai.model.js';
import Artifact from '../artifacts/artifact.model.js';
import { validateOwnership } from '../../utils/ownership.js';
import AppError from '../../utils/AppError.js';
import mongoose from 'mongoose';

export const createProject = async (userId, projectData) => {
  const { project_title, project_description } = projectData;

  if (!project_title) {
    throw new AppError('Project title is required', 400);
  }

  return await Project.create({
    owner: userId,
    project_title,
    project_description,
  });
};

export const getProjects = async (userId) => {
  return await Project.find({ owner: userId }).sort({ createdAt: -1 });
};

export const getProjectById = async (userId, projectId) => {
  return await validateOwnership(Project, projectId, userId, 'Project');
};

export const updateProject = async (userId, projectId, updateData) => {
  const project = await validateOwnership(Project, projectId, userId, 'Project');

  if (updateData.project_title) project.project_title = updateData.project_title;
  if (updateData.project_description) project.project_description = updateData.project_description;
  if (updateData.project_status) project.project_status = updateData.project_status;
  if (updateData.wizard_state !== undefined) project.wizard_state = updateData.wizard_state;

  await project.save();
  return project;
};

export const deleteProject = async (userId, projectId) => {
  const project = await validateOwnership(Project, projectId, userId, 'Project');
  const ideaId = project.wizard_state?.ideaId;

  if (ideaId) {
    await validateOwnership(Idea, ideaId, userId, 'Idea');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session };

    /* Cascade deletion of all resources linked to the project or its idea */
    await Project.deleteOne({ _id: projectId, owner: userId }, opts);
    await Task.deleteMany({ project: projectId }, opts);
    await Context.deleteMany({ project: projectId }, opts);
    await Artifact.deleteMany({ project: projectId }, opts);
    await AIGeneration.deleteMany({ project: projectId, owner: userId }, opts);

    if (ideaId) {
      await Idea.deleteOne({ _id: ideaId, owner: userId }, opts);
      await Brief.deleteMany({ idea: ideaId, owner: userId }, opts);
      await AIGeneration.deleteMany({ idea: ideaId, owner: userId }, opts);
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return project;
};
