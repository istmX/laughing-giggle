import express from 'express';
import {
  createSession,
  getSessions,
  getSession,
  deleteSession,
  updateSessionTitle,
  addMessage,
} from './playground.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';

const PlaygroundRouter = express.Router();

PlaygroundRouter.use(authMiddleware);

PlaygroundRouter.post('/', createSession);
PlaygroundRouter.get('/', getSessions);
PlaygroundRouter.get('/:sessionId', getSession);
PlaygroundRouter.put('/:sessionId/title', updateSessionTitle);
PlaygroundRouter.delete('/:sessionId', deleteSession);
PlaygroundRouter.post('/:sessionId/message', rateLimitMiddleware, addMessage);

export default PlaygroundRouter;
