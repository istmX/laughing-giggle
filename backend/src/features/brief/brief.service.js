import Brief from './brief.model.js';
import Idea from '../ideas/idea.model.js';
import { validateOwnership, validateId } from '../../utils/ownership.js';
import AppError from '../../utils/AppError.js';

export const createBrief = async (userId, ideaId) => {
  const existingIdea = await validateOwnership(Idea, ideaId, userId, 'Idea');

  const existingBrief = await Brief.findOne({
    idea: ideaId,
    owner: userId
  });

  if (existingBrief) {
    throw new AppError('Brief already exists for this idea', 409);
  }

  return await Brief.create({
    owner: userId,
    idea: ideaId
  });
};

export const getBriefs = async (userId) => {
  return await Brief.find({ owner: userId })
    .populate({
      path: 'idea',
      select: 'prompt createdAt'
    })
    .sort({ createdAt: -1 });
};

export const getBriefById = async (userId, briefId) => {
  validateId(briefId, 'brief id');
  const brief = await Brief.findOne({ _id: briefId, owner: userId })
    .populate({
      path: 'idea',
      select: 'prompt createdAt'
    });

  if (!brief) {
    throw new AppError('Brief not found', 404);
  }

  return brief;
};

export const updateBrief = async (userId, briefId, updateData) => {
  const brief = await validateOwnership(Brief, briefId, userId, 'Brief');

  const allowedFields = [
    'application_type',
    'target_users',
    'platform',
    'frontend_stack',
    'backend_stack',
    'database',
    'ui_style',
    'answers',
    'missing_fields',
    'is_complete',
    'generated_by_ai'
  ];

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      brief[field] = updateData[field];
    }
  });

  await brief.save();
  return brief;
};

export const deleteBrief = async (userId, briefId) => {
  await validateOwnership(Brief, briefId, userId, 'Brief');
  await Brief.findByIdAndDelete(briefId);
};
