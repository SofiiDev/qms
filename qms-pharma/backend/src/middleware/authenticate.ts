import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { env } from '../config/env.js';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export function authenticateToken(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    next(createError(401, 'Token requerido'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.user = { id: payload.sub, email: payload.email, role: payload.role as Express.User['role'] };
    next();
  } catch {
    next(createError(401, 'Token inválido'));
  }
}
