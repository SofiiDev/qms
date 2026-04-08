# QMS Pharma

Sistema SaaS de gestión de calidad farmacéutica orientado a cumplimiento GAMP 5, ANMAT y FDA 21 CFR Part 11.

## Requisitos
- Node.js 20+
- PostgreSQL 14+

## Instalación

### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno (backend)
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_SECRET`
- `PORT`
- `CLIENT_ORIGIN`

## Seguridad destacada
- JWT access (15 min) + refresh token (7 días) en cookie `httpOnly`.
- Validación estricta con Zod y `.strict()` en payloads.
- Helmet, CORS explícito, rate limits y verificación de `Origin` en mutaciones.
- Audit trail inmutable en `audit_logs`.
