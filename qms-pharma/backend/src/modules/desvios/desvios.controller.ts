import type { Request, Response } from 'express';
import createError from 'http-errors';
import { createAuditLog } from '../../utils/audit.js';
import { desviosService } from './desvios.service.js';

export const desviosController = {
  async list(req: Request, res: Response) {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 20);
    res.json(await desviosService.list(page, pageSize));
  },
  async get(req: Request, res: Response) {
    const item = await desviosService.getById(req.params.id);
    if (!item) throw createError(404, 'Desvío no encontrado');
    const history = await (await import('../../config/database.js')).prisma.auditLog.findMany({ where: { module: 'DESVIOS', recordId: item.id }, orderBy: { timestamp: 'desc' } });
    res.json({ ...item, history });
  },
  async create(req: Request, res: Response) {
    const created = await desviosService.create(req.validatedBody, req.user!.id);
    await createAuditLog({ userId: req.user?.id, module: 'DESVIOS', action: 'CREATE', recordId: created.id, newValue: created, ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    res.status(201).json(created);
  },
  async update(req: Request, res: Response) {
    const before = await desviosService.getById(req.params.id);
    const updated = await desviosService.update(req.params.id, req.validatedBody as any);
    await createAuditLog({ userId: req.user?.id, module: 'DESVIOS', action: 'UPDATE', recordId: updated.id, oldValue: before, newValue: updated, ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    res.json(updated);
  },
  async remove(req: Request, res: Response) {
    const deleted = await desviosService.remove(req.params.id);
    await createAuditLog({ userId: req.user?.id, module: 'DESVIOS', action: 'DELETE', recordId: deleted.id, oldValue: deleted, ipAddress: req.ip, userAgent: req.headers['user-agent'] });
    res.status(204).send();
  },
  async stats(_req: Request, res: Response) {
    res.json(await desviosService.stats());
  },
};
