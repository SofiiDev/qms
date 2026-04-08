import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';
import { validateBody } from '../../middleware/validate.js';
import { capasController } from './capas.controller.js';
import { createCapaSchema, updateCapaSchema } from './capas.schema.js';

export const capasRouter = Router();

capasRouter.use(authenticateToken);
capasRouter.get('/', authorizeRole(['VIEWER']), capasController.list);
capasRouter.get('/:id', authorizeRole(['VIEWER']), capasController.get);
capasRouter.post('/', authorizeRole(['QUALITY_ANALYST']), validateBody(createCapaSchema), capasController.create);
capasRouter.patch('/:id', authorizeRole(['QUALITY_ANALYST']), validateBody(updateCapaSchema), capasController.update);
capasRouter.delete('/:id', authorizeRole(['QUALITY_MANAGER']), capasController.remove);
