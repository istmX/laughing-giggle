import express from 'express';
import { getProfile, updateProfile, updatePfp, deleteAccount, getPublicProfile, toggleFollow } from './profile.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

const ProfileRouter = express.Router();

// Public route (Must be declared before authMiddleware)
ProfileRouter.get('/u/:username', getPublicProfile);

// Protected routes
ProfileRouter.use(authMiddleware);

ProfileRouter.get('/', getProfile);
ProfileRouter.put('/', updateProfile);
ProfileRouter.put('/pfp', updatePfp);
ProfileRouter.delete('/', deleteAccount);
ProfileRouter.post('/follow/:username', toggleFollow);

export default ProfileRouter;
