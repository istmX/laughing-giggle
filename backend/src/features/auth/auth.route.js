import express from 'express';
import { registerUser ,loginUser, logoutUser ,getMe } from './auth.controller.js';
import { authMiddleware } from './auth.middleware.js';
const AuthRouter = express.Router();

AuthRouter.post('/register',registerUser)
AuthRouter.post('/login',loginUser)
AuthRouter.post('/logout', authMiddleware, logoutUser)
AuthRouter.get('/me', authMiddleware, getMe)

export default AuthRouter;