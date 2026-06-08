import Idea from './idea.model.js';
import Brief from '../brief/brief.model.js';
import Context from '../context/context.model.js';
import { validateOwnership } from '../../utils/ownership.js';
import AppError from '../../utils/AppError.js';

export const createIdea = async (userId, ideaData) => {
  const { prompt } = ideaData;

  if (!prompt) {
    throw new AppError('Idea prompt is required', 400);
  }

  return await Idea.create({
    owner: userId,
    prompt
  });
};

export const getIdeas = async (userId) => {
  return await Idea.find({ owner: userId }).sort({ createdAt: -1 });
};

export const getIdeaById = async (userId, ideaId) => {
  return await validateOwnership(Idea, ideaId, userId, 'Idea');
};

export const updateIdea = async (userId, ideaId, updateData) => {
  const idea = await validateOwnership(Idea, ideaId, userId, 'Idea');

  const { prompt, status } = updateData;
  if (prompt) idea.prompt = prompt;
  if (status) idea.status = status;

  await idea.save();
  return idea;
};

export const deleteIdea = async (userId, ideaId) => {
  const idea = await validateOwnership(Idea, ideaId, userId, 'Idea');
  
  /* Cascade deletion */
  await Promise.all([
    Idea.findByIdAndDelete(ideaId),
    Brief.deleteMany({ idea: ideaId }),
    Context.deleteMany({ idea: ideaId })
  ]);

  return idea;
};
