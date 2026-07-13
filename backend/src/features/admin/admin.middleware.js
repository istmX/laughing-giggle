import AppError from '../../utils/AppError.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Not authenticated', 401));
  }
  
  if (req.user.isAdmin !== true) {
    return next(new AppError('Forbidden: Admin access required', 403));
  }

  next();
};
