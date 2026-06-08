import AppError from '../utils/AppError.js';

/**
 * Middleware to validate request data using Zod schema.
 * @param {z.ZodSchema} schema - Zod schema to validate against.
 * @param {string} source - Request property to validate ('body', 'params', 'query').
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (error) {
    const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    next(new AppError(message, 400));
  }
};

export default validate;
