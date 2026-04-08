import type { Request, Response } from 'express';
import createError from 'http-errors';
import { createAuditLog } from '../../utils/audit.js';
import { cambiosService } from './cambios.service.js';

export const cambiosController = {
  async list(_req: Request, res: Response) { res.json(await cambiosService.list()); },
  async get(req: Request, res: Response) { const item = await cambiosService.getById(req.params.id); if (!item) throw createError(404, 'Cambio no encontrado'); res.json(item); },
  async create(req: Request, res: Response) { const created = await cambiosService.create(req.validatedBody, req.user!.id); await createAuditLog({ userId: req.user?.id, module: 'CAMBIOS', action: 'CREATE', recordId: created.id, newValue: created, ipAddress: req.ip, userAgent: req.headers['user-agent'] }); res.status(201).json(created); },
  async update(req: Request, res: Response) { const before = await cambiosService.getById(req.params.id); const updated = await cambiosService.update(req.params.id, req.validatedBody as any); await createAuditLog({ userId: req.user?.id, module: 'CAMBIOS', action: 'UPDATE', recordId: updated.id, oldValue: before, newValue: updated, ipAddress: req.ip, userAgent: req.headers['user-agent'] }); res.json(updated); },
  async remove(req: Request, res: Response) { const deleted = await cambiosService.remove(req.params.id); await createAuditLog({ userId: req.user?.id, module: 'CAMBIOS', action: 'DELETE', recordId: deleted.id, oldValue: deleted, ipAddress: req.ip, userAgent: req.headers['user-agent'] }); res.status(204).send(); },
};
