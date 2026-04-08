import type { NextFunction, Request, Response } from 'express';
import { createAuditLog } from '../utils/audit.js';

export function auditAction(moduleName: string, action: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    await createAuditLog({
      userId: req.user?.id,
      module: moduleName,
      action,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      newValue: { body: req.body },
    });
    next();
  };
}
