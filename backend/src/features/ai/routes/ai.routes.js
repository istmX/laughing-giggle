import express from 'express';
import { analyzeIdea } from '../controllers/idea.controller.js';
import { generateQuestions } from '../controllers/question.controller.js';
import { generateContext } from '../controllers/context.controller.js';
import { generateTasks } from '../controllers/task.controller.js';
import { generateDocumentation } from '../controllers/documentation.controller.js';
import { generateRefinement } from '../controllers/refinement.controller.js';
import { processConversation } from '../controllers/conversational.controller.js';
import { authMiddleware } from '../../auth/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/analyze/:ideaId', analyzeIdea);
router.post('/questions/:ideaId', generateQuestions);
router.post('/refine/:ideaId', generateRefinement);
router.post('/conversation/:ideaId', processConversation);
router.post('/context/:ideaId', generateContext);
router.post('/tasks/:ideaId', generateTasks);
router.post('/documentation/:ideaId', generateDocumentation);

export default router;
