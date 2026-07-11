import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './config/cors.js';
import AuthRouter from './features/auth/auth.route.js';
import ProjectRouter from './features/projects/project.routes.js';
import TaskRouter from './features/tasks/task.routes.js';
import IdeaRouter from './features/ideas/idea.routes.js';
import ContextRouter from './features/context/context.routes.js';
import BriefRouter from './features/brief/brief.routes.js';
import AIRouter from './features/ai/routes/ai.routes.js';
import AppError from './utils/AppError.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

app.set('trust proxy', process.env.TRUST_PROXY || 'loopback');

app.use(corsMiddleware);
app.options(/.*/, corsMiddleware);
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
import ArtifactRouter from './features/artifacts/artifact.routes.js';

app.use('/api/auth',AuthRouter)
app.use('/api/projects', ProjectRouter);
app.use('/api/tasks', TaskRouter);
app.use('/api/ideas', IdeaRouter);
app.use('/api/context', ContextRouter);
app.use('/api/brief', BriefRouter);
app.use('/api/ai', AIRouter)
app.use('/api/artifacts', ArtifactRouter);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/* Global error handling middleware */
app.use(errorMiddleware);

export default app;

