import express from 'express';
import { registerUser ,LoginUser } from './auth.controller.js';
const Router = express.Router();

Router.post('/register',registerUser)
Router.post('/login',LoginUser)

export default Router;