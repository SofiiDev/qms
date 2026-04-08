import type { Request, Response } from 'express';
import createError from 'http-errors';
import { createAuditLog } from '../../utils/audit.js';
import { capasService } from './capas.service.js';

export const capasController = {
  async list(_req: Request, res: Response) { res.json(await capasService.list()); },
  async get(req: Request, res: Response) { const item = await capasService.getById(req.params.id); if (!item) throw createError(404, 'CAPA no encontrada'); res.json(item); },
  async create(req: Request, res: Response) { const created = await capasService.create(req.validatedBody, req.user!.id); await createAuditLog({ userId: req.user?.id, module: 'CAPAS', action: 'CREATE', recordId: created.id, newValue: created, ipAddress: req.ip, userAgent: req.headers['user-agent'] }); res.status(201).json(created); },
  async update(req: Request, res: Response) { const before = await capasService.getById(req.params.id); const updated = await capasService.update(req.params.id, req.validatedBody as any); await createAuditLog({ userId: req.user?.id, module: 'CAPAS', action: 'UPDATE', recordId: updated.id, oldValue: before, newValue: updated, ipAddress: req.ip, userAgent: req.headers['user-agent'] }); res.json(updated); },
  async remove(req: Request, res: Response) { const deleted = await capasService.remove(req.params.id); await createAuditLog({ userId: req.user?.id, module: 'CAPAS', action: 'DELETE', recordId: deleted.id, oldValue: deleted, ipAddress: req.ip, userAgent: req.headers['user-agent'] }); res.status(204).send(); },
};
