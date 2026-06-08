import rateLimit from 'express-rate-limit';

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, /* 15 minutes */
  max: 10, /* Limit each IP to 10 requests per `window` */
  message: {
    status: 'fail',
    message: 'Too many requests for AI generation, please try again after 15 minutes',
  },
  standardHeaders: true, /* Return rate limit info in the `RateLimit-*` headers */
  legacyHeaders: false, /* Disable the `X-RateLimit-*` headers */
});
