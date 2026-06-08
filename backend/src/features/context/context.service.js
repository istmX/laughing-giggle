import Context from './context.model.js';
import Idea from '../ideas/idea.model.js';
import Project from '../projects/project.model.js';
import { validateOwnership, validateId } from '../../utils/ownership.js';
import AppError from '../../utils/AppError.js';

export const createContext = async (userId, ideaId) => {
  validateId(ideaId, 'idea id');
  
  await validateOwnership(Idea, ideaId, userId, 'Idea');

  return await Context.create({
    owner: userId,
    idea: ideaId,
  });
};

export const getContexts = async (userId) => {
  return await Context.find({ owner: userId })
    .populate('idea')
    .populate('project')
    .sort({ createdAt: -1 });
};

export const getContextById = async (userId, contextId) => {
  validateId(contextId, 'context id');
  const context = await Context.findOne({ _id: contextId, owner: userId })
    .populate('idea')
    .populate('project');

  if (!context) {
    throw new AppError('Context not found', 404);
  }

  return context;
};

export const updateContext = async (userId, contextId, updateData) => {
  const context = await validateOwnership(Context, contextId, userId, 'Context');

  const {
    project,
    project_overview,
    build_plan,
    architecture,
    code_standards,
    library_docs,
    progress_tracker,
    ui_rules,
    ui_tokens,
    ui_registry,
    agents,
    readme,
  } = updateData;

  if (project !== undefined) {
    if (project !== null) {
      await validateOwnership(Project, project, userId, 'Project');
      context.project = project;
    } else {
      context.project = null;
    }
  }

  const textFields = [
    'project_overview',
    'build_plan',
    'architecture',
    'mermaid_diagram',
    'code_standards',
    'library_docs',
    'progress_tracker',
    'ui_rules',
    'ui_tokens',
    'ui_registry',
    'agents',
    'readme',
  ];

  textFields.forEach(field => {
    if (updateData[field] !== undefined) {
      context[field] = updateData[field];
    }
  });

  await context.save();
  return context;
};

export const deleteContext = async (userId, contextId) => {
  await validateOwnership(Context, contextId, userId, 'Context');
  await Context.findByIdAndDelete(contextId);
};
