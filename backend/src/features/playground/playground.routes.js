import express from 'express';
import {
  createSession,
  getSessions,
  getSession,
  deleteSession,
  updateSessionTitle,
} from './playground.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

const PlaygroundRouter = express.Router();

PlaygroundRouter.use(authMiddleware);

PlaygroundRouter.post('/', createSession);
PlaygroundRouter.get('/', getSessions);
PlaygroundRouter.get('/:sessionId', getSession);
PlaygroundRouter.put('/:sessionId/title', updateSessionTitle);
PlaygroundRouter.delete('/:sessionId', deleteSession);

export default PlaygroundRouter;
