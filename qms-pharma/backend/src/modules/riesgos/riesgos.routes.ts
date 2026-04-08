import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';
import { validateBody } from '../../middleware/validate.js';
import { riesgosController } from './riesgos.controller.js';
import { createRiesgoSchema, updateRiesgoSchema } from './riesgos.schema.js';

export const riesgosRouter = Router();

riesgosRouter.use(authenticateToken);
riesgosRouter.get('/', authorizeRole(['VIEWER']), riesgosController.list);
riesgosRouter.get('/:id', authorizeRole(['VIEWER']), riesgosController.get);
riesgosRouter.post('/', authorizeRole(['QUALITY_ANALYST']), validateBody(createRiesgoSchema), riesgosController.create);
riesgosRouter.patch('/:id', authorizeRole(['QUALITY_ANALYST']), validateBody(updateRiesgoSchema), riesgosController.update);
riesgosRouter.delete('/:id', authorizeRole(['QUALITY_MANAGER']), riesgosController.remove);
