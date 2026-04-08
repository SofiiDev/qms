import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { ROLE_HIERARCHY } from '../config/constants.js';

export function authorizeRole(allowed: Array<keyof typeof ROLE_HIERARCHY>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError(401, 'No autenticado'));
      return;
    }
    const currentLevel = ROLE_HIERARCHY[req.user.role];
    const ok = allowed.some((role) => currentLevel >= ROLE_HIERARCHY[role]);
    if (!ok) {
      next(createError(403, 'Sin permisos'));
      return;
    }
    next();
  };
}
