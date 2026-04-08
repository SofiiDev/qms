import './config/env.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { verifyOrigin } from './middleware/csrf.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { desviosRouter } from './modules/desvios/desvios.routes.js';
import { cambiosRouter } from './modules/cambios/cambios.routes.js';
import { riesgosRouter } from './modules/riesgos/riesgos.routes.js';
import { documentosRouter } from './modules/documentos/documentos.routes.js';
import { capasRouter } from './modules/capas/capas.routes.js';
import { aiRouter } from './modules/ai/ai.routes.js';
import { auditRouter } from './modules/audit/audit.routes.js';

export const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: { defaultSrc: ["'self'"] },
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    hsts: { maxAge: 31536000 },
    referrerPolicy: { policy: 'no-referrer' },
  }),
);

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(verifyOrigin);
app.use(generalLimiter);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'qms-pharma-backend' }));

app.use('/api/auth', authRouter);
app.use('/api/desvios', desviosRouter);
app.use('/api/cambios', cambiosRouter);
app.use('/api/riesgos', riesgosRouter);
app.use('/api/documentos', documentosRouter);
app.use('/api/capas', capasRouter);
app.use('/api/ai', aiRouter);
app.use('/api/audit', auditRouter);

app.use(errorHandler);
