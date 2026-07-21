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

let trustProxy = process.env.TRUST_PROXY || 'loopback';
if (trustProxy === 'trusted' || trustProxy === 'true' || trustProxy === '1') {
  trustProxy = 1;
}
app.set('trust proxy', trustProxy);

app.use(corsMiddleware);
app.options(/.*/, corsMiddleware);
app.use(express.json());
app.use(cookieParser());


import { globalRateLimiter } from './middleware/rateLimit.middleware.js';

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
import ProfileRouter from './features/profile/profile.routes.js';
import PlaygroundRouter from './features/playground/playground.routes.js';
import AdminRouter from './features/admin/admin.routes.js';
import ExploreRouter from './features/explore/explore.routes.js';

app.use('/api', globalRateLimiter);
app.use('/api/auth',AuthRouter)
app.use('/api/projects', ProjectRouter);
app.use('/api/tasks', TaskRouter);
app.use('/api/ideas', IdeaRouter);
app.use('/api/context', ContextRouter);
app.use('/api/brief', BriefRouter);
app.use('/api/ai', AIRouter)
app.use('/api/artifacts', ArtifactRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/playground', PlaygroundRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/explore', ExploreRouter);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/* Global error handling middleware */
app.use(errorMiddleware);

export default app;

