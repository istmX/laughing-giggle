import express from 'express';
import Router from './features/auth/auth.route.js';
const app = express();

app.use(express.json());
app.use('/api/auth',Router)

export default app;


