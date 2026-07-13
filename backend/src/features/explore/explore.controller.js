import { exploreService } from './explore.service.js';
import AppError from '../../utils/AppError.js';

export const getPublicUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await exploreService.getPublicUsers(page, limit);
    res.status(200).json(data);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return next(new AppError('Search query is required', 400));
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await exploreService.searchUsers(q, page, limit);
    res.status(200).json(data);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const getTopUsers = async (req, res, next) => {
  try {
    const data = await exploreService.getTopUsers();
    res.status(200).json({ users: data });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
