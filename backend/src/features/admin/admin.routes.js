import express from 'express';
import { getUsers, updateUser, createUser, deleteUser, getProjects, deleteProject, getStats } from './admin.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { requireAdmin } from './admin.middleware.js';

const AdminRouter = express.Router();

AdminRouter.use(authMiddleware);
AdminRouter.use(requireAdmin);

AdminRouter.get('/users', getUsers);
AdminRouter.post('/users', createUser);
AdminRouter.put('/users/:userId', updateUser);
AdminRouter.delete('/users/:userId', deleteUser);

AdminRouter.get('/projects', getProjects);
AdminRouter.delete('/projects/:projectId', deleteProject);

AdminRouter.get('/stats', getStats);

export default AdminRouter;
