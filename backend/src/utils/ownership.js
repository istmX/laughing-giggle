import mongoose from 'mongoose';
import AppError from './AppError.js';

/**
 * Validates if a document exists and if the user is the owner.
 * @param {mongoose.Model} Model - The Mongoose model to query.
 * @param {string} id - The ID of the document.
 * @param {string} userId - The ID of the user requesting access.
 * @param {string} resourceName - Name of the resource for error messages.
 * @returns {Promise<Document>} - The found document.
 * @throws {AppError} - If validation fails.
 */
export const validateOwnership = async (Model, id, userId, resourceName = 'Resource') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${resourceName.toLowerCase()} id`, 400);
  }

  const resource = await Model.findOne({ _id: id, owner: userId });

  if (!resource) {
    throw new AppError(`${resourceName} not found or access denied`, 404);
  }

  return resource;
};

/**
 * Validates if an ID is a valid MongoDB ObjectId.
 * @param {string} id 
 * @param {string} name 
 */
export const validateId = (id, name = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${name}`, 400);
  }
};
