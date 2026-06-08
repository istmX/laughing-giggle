import mongoose from 'mongoose';
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

  if (updateData.prompt !== undefined) idea.prompt = updateData.prompt;
  if (updateData.status !== undefined) idea.status = updateData.status;

  await idea.save();
  return idea;
};

export const deleteIdea = async (userId, ideaId) => {
  await validateOwnership(Idea, ideaId, userId, 'Idea');
  
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Brief.deleteMany({ idea: ideaId }, { session });
    await Context.deleteMany({ idea: ideaId }, { session });
    await Idea.findByIdAndDelete(ideaId, { session });
    await session.commitTransaction();
    return { deleted: true };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
