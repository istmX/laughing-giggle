import AppError from '../../utils/AppError.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Access denied: Requires administrator privileges' });
  }

  next();
};
