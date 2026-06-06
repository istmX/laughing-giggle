import express from 'express'

import {createProject, getProjects, getProjectById, deleteProject, updateProject} from './project.contoller.js'
import { authMiddleware } from '../auth/auth.middleware.js';

const ProjectRouter = express.Router();


ProjectRouter.post('/', authMiddleware, createProject);
ProjectRouter.get('/', authMiddleware, getProjects);
ProjectRouter.get('/:id', authMiddleware, getProjectById);
ProjectRouter.delete('/:id', authMiddleware, deleteProject);
ProjectRouter.patch('/:id', authMiddleware, updateProject);



export default ProjectRouter;