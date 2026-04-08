import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';
import { validateBody } from '../../middleware/validate.js';
import { documentosController } from './documentos.controller.js';
import { createDocumentoSchema, updateDocumentoSchema } from './documentos.schema.js';

export const documentosRouter = Router();

documentosRouter.use(authenticateToken);
documentosRouter.get('/', authorizeRole(['VIEWER']), documentosController.list);
documentosRouter.get('/:id', authorizeRole(['VIEWER']), documentosController.get);
documentosRouter.post('/', authorizeRole(['QUALITY_ANALYST']), validateBody(createDocumentoSchema), documentosController.create);
documentosRouter.patch('/:id', authorizeRole(['QUALITY_ANALYST']), validateBody(updateDocumentoSchema), documentosController.update);
documentosRouter.delete('/:id', authorizeRole(['QUALITY_MANAGER']), documentosController.remove);
