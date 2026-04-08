import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';
import { aiLimiter } from '../../middleware/rateLimiter.js';
import { validateBody } from '../../middleware/validate.js';
import { assistController } from './ai.controller.js';
import { aiAssistSchema } from './ai.schema.js';

export const aiRouter = Router();

aiRouter.post('/assist', authenticateToken, authorizeRole(['QUALITY_ANALYST']), aiLimiter, validateBody(aiAssistSchema), assistController);
