import type { Request, Response } from 'express';
import { createAuditLog } from '../../utils/audit.js';
import { askAssistant } from './ai.service.js';

export async function assistController(req: Request, res: Response): Promise<void> {
  const body = req.validatedBody as { module: string; action: string; context: Record<string, unknown> };
  const answer = await askAssistant(body);
  await createAuditLog({ userId: req.user?.id, module: 'AI', action: 'ASSIST', newValue: { module: body.module, action: body.action }, ipAddress: req.ip, userAgent: req.headers['user-agent'] });
  res.json({ answer });
}
