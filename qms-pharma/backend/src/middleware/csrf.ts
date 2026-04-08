import type { NextFunction, Request, Response } from 'express';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function verifyOrigin(req: Request, res: Response, next: NextFunction): void {
  if (!MUTATION_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.headers.origin;
  if (!origin || origin !== process.env.CLIENT_ORIGIN) {
    res.status(403).json({ error: 'Invalid origin' });
    return;
  }

  next();
}
