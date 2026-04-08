import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error({ message: error.message, stack: error.stack });

  if (env.nodeEnv === 'production') {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }

  res.status(500).json({ error: error.message, stack: error.stack });
}
