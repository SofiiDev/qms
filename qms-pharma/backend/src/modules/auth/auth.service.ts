import { Role, type User } from '@prisma/client';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN_DAYS } from '../../config/constants.js';
import { env } from '../../config/env.js';

function signAccessToken(user: User): string {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function signRefreshToken(user: User): string {
  return jwt.sign({ sub: user.id }, env.jwtRefreshSecret, { expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d` });
}

export async function register(data: { email: string; password: string; fullName: string; role: Role }): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw createError(409, 'Email ya registrado');
  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.create({
    data: { email: data.email, passwordHash, fullName: data.fullName, role: data.role },
  });
}

export async function login(data: { email: string; password: string }, metadata: { ipAddress?: string; userAgent?: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw createError(401, 'Credenciales inválidas');
  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw createError(401, 'Credenciales inválidas');

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const tokenHash = await bcrypt.hash(refreshToken, 12);

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { tokenHash, userId: user.id, expiresAt, ipAddress: metadata.ipAddress, userAgent: metadata.userAgent },
  });

  return { accessToken, refreshToken, user };
}

export async function refresh(refreshToken?: string) {
  if (!refreshToken) throw createError(401, 'Refresh token requerido');
  let payload: { sub: string };
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as { sub: string };
  } catch {
    throw createError(401, 'Refresh token inválido');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw createError(401, 'Usuario inválido');

  const activeTokens = await prisma.refreshToken.findMany({ where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } } });
  const match = await Promise.any(activeTokens.map(async (token) => ((await bcrypt.compare(refreshToken, token.tokenHash)) ? token : Promise.reject()))).catch(() => null);
  if (!match) throw createError(401, 'Refresh token no reconocido');

  return { accessToken: signAccessToken(user) };
}

export async function logout(refreshToken?: string): Promise<void> {
  if (!refreshToken) return;
  const tokens = await prisma.refreshToken.findMany({ where: { revokedAt: null } });
  for (const token of tokens) {
    if (await bcrypt.compare(refreshToken, token.tokenHash)) {
      await prisma.refreshToken.update({ where: { id: token.id }, data: { revokedAt: new Date() } });
      return;
    }
  }
}
