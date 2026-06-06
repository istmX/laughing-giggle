import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRouter from './features/auth/auth.route.js';
import ProjectRouter from './features/projects/project.routes.js';
import TaskRouter from './features/tasks/task.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());




app.use('/api/auth',AuthRouter)
app.use('/api/projects', ProjectRouter);
app.use('/api/tasks', TaskRouter);



export default app;


