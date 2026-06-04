import express from 'express';
import { registerUser ,loginUser, logoutUser } from './auth.controller.js';
const AuthRouter = express.Router();

AuthRouter.post('/register',registerUser)
AuthRouter.post('/login',loginUser)
AuthRouter.post('/logout',logoutUser)

export default AuthRouter;