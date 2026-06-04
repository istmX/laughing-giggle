import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRouter from './features/auth/auth.route.js';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',AuthRouter)

export default app;


