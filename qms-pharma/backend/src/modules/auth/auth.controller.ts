import type { Request, Response } from 'express';
import { createAuditLog } from '../../utils/audit.js';
import { login, logout, refresh, register } from './auth.service.js';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api/auth',
};

export async function registerController(req: Request, res: Response): Promise<void> {
  const created = await register(req.validatedBody as never);
  await createAuditLog({ userId: req.user?.id, module: 'AUTH', action: 'REGISTER_USER', recordId: created.id, ipAddress: req.ip, userAgent: req.headers['user-agent'] });
  res.status(201).json({ id: created.id, email: created.email, role: created.role, fullName: created.fullName });
}

export async function loginController(req: Request, res: Response): Promise<void> {
  const result = await login(req.validatedBody as never, { ipAddress: req.ip, userAgent: req.headers['user-agent'] });
  res.cookie('refresh_token', result.refreshToken, cookieOptions);
  res.json({ access_token: result.accessToken, user: { id: result.user.id, email: result.user.email, role: result.user.role, fullName: result.user.fullName } });
}

export async function refreshController(req: Request, res: Response): Promise<void> {
  const result = await refresh(req.cookies.refresh_token);
  res.json({ access_token: result.accessToken });
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  await logout(req.cookies.refresh_token);
  res.clearCookie('refresh_token', cookieOptions);
  res.status(204).send();
}
