import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';
import { validateBody } from '../../middleware/validate.js';
import { desviosController } from './desvios.controller.js';
import { createDesvioSchema, updateDesvioSchema } from './desvios.schema.js';

export const desviosRouter = Router();

desviosRouter.use(authenticateToken);
desviosRouter.get('/stats', authorizeRole(['QUALITY_ANALYST']), desviosController.stats);
desviosRouter.get('/', authorizeRole(['VIEWER']), desviosController.list);
desviosRouter.get('/:id', authorizeRole(['VIEWER']), desviosController.get);
desviosRouter.post('/', authorizeRole(['QUALITY_ANALYST']), validateBody(createDesvioSchema), desviosController.create);
desviosRouter.patch('/:id', authorizeRole(['QUALITY_ANALYST']), validateBody(updateDesvioSchema), desviosController.update);
desviosRouter.delete('/:id', authorizeRole(['QUALITY_MANAGER']), desviosController.remove);
