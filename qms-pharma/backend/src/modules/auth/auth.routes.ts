import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { validateBody } from '../../middleware/validate.js';
import { loginController, logoutController, refreshController, registerController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schema.js';

export const authRouter = Router();

authRouter.post('/register', authenticateToken, authorizeRole(['ADMIN']), validateBody(registerSchema), registerController);
authRouter.post('/login', authLimiter, validateBody(loginSchema), loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
