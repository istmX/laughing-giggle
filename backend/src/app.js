import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRouter from './features/auth/auth.route.js';
import ProjectRouter from './features/projects/project.routes.js';
import TaskRouter from './features/tasks/task.routes.js';
import IdeaRouter from './features/ideas/idea.routes.js';
import ContextRouter from './features/context/context.routes.js';
import BriefRouter from './features/brief/brief.routes.js';
import AIRouter from './features/ai/ai.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());



/**
    * Routes
    * Auth routes
    * Project routes
    * Task routes
    * Idea routes
    * Context routes
    * Brief routes
    * AI routes
**/
app.use('/api/auth',AuthRouter)
app.use('/api/projects', ProjectRouter);
app.use('/api/tasks', TaskRouter);
app.use('/api/ideas', IdeaRouter);
app.use('/api/context', ContextRouter);
app.use('/api/brief', BriefRouter);
app.use('/api/ai', AIRouter)



export default app;


