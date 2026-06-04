import express from 'express';
import { registerUser } from './auth.controller.js';
const Router = express.Router();

Router.post('/register',registerUser)

export default Router;