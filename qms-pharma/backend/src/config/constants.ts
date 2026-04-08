export const ACCESS_TOKEN_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

export const ROLE_HIERARCHY = {
  VIEWER: 0,
  QUALITY_ANALYST: 1,
  QUALITY_MANAGER: 2,
  ADMIN: 3,
} as const;

export const MODULES = ['auth', 'desvios', 'cambios', 'riesgos', 'documentos', 'capas', 'audit', 'ai'] as const;
