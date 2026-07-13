import express from 'express';
import { getUsers, updateUser, getProjects, getStats } from './admin.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { requireAdmin } from './admin.middleware.js';

const AdminRouter = express.Router();

AdminRouter.use(authMiddleware);
AdminRouter.use(requireAdmin);

AdminRouter.get('/users', getUsers);
AdminRouter.put('/users/:userId', updateUser);
AdminRouter.get('/projects', getProjects);
AdminRouter.get('/stats', getStats);

export default AdminRouter;
