import express from 'express';
import { getProfile, updateProfile, updatePfp, deleteAccount } from './profile.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

const ProfileRouter = express.Router();

ProfileRouter.use(authMiddleware);

ProfileRouter.get('/', getProfile);
ProfileRouter.put('/', updateProfile);
ProfileRouter.put('/pfp', updatePfp);
ProfileRouter.delete('/', deleteAccount);

export default ProfileRouter;
