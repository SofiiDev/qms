import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';
import { validateBody } from '../../middleware/validate.js';
import { cambiosController } from './cambios.controller.js';
import { createCambioSchema, updateCambioSchema } from './cambios.schema.js';

export const cambiosRouter = Router();

cambiosRouter.use(authenticateToken);
cambiosRouter.get('/', authorizeRole(['VIEWER']), cambiosController.list);
cambiosRouter.get('/:id', authorizeRole(['VIEWER']), cambiosController.get);
cambiosRouter.post('/', authorizeRole(['QUALITY_ANALYST']), validateBody(createCambioSchema), cambiosController.create);
cambiosRouter.patch('/:id', authorizeRole(['QUALITY_ANALYST']), validateBody(updateCambioSchema), cambiosController.update);
cambiosRouter.delete('/:id', authorizeRole(['QUALITY_MANAGER']), cambiosController.remove);
