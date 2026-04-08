import dotenv from 'dotenv';

dotenv.config();

const required = ['ANTHROPIC_API_KEY', 'DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'SESSION_SECRET'] as const;
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY as string,
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  sessionSecret: process.env.SESSION_SECRET as string,
};
