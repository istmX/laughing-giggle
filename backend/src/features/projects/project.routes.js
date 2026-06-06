import express from 'express'

import {createProject, getProjects, getProjectById, deleteProject, updateProject} from './project.conroller.js'
import { isLoggedIn } from '../auth/auth.middleware.js';

const ProjectRouter = express.Router();


ProjectRouter.post('/', isLoggedIn, createProject);
ProjectRouter.get('/', isLoggedIn, getProjects);
ProjectRouter.get('/:id', isLoggedIn, getProjectById);
ProjectRouter.delete('/:id', isLoggedIn, deleteProject);
ProjectRouter.put('/:id', isLoggedIn, updateProject);

export default ProjectRouter;