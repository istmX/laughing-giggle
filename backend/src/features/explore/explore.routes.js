import express from 'express';
import { getPublicUsers, searchUsers, getTopUsers } from './explore.controller.js';

const ExploreRouter = express.Router();

ExploreRouter.get('/users/top', getTopUsers);
ExploreRouter.get('/users/search', searchUsers);
ExploreRouter.get('/users', getPublicUsers);

export default ExploreRouter;
