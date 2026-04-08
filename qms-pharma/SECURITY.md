# SECURITY - QMS Pharma

## Controles implementados

1. **Secretos y Anthropic API key**
   - `ANTHROPIC_API_KEY` solo en backend vía variables de entorno.
   - El SDK de Anthropic se importa únicamente en `backend/src/modules/ai/ai.service.ts`.

2. **Autenticación y sesión**
   - Contraseñas hasheadas con bcrypt salt rounds 12.
   - Access token JWT 15 minutos.
   - Refresh token 7 días en cookie `httpOnly`, `Secure`, `SameSite=Strict`.
   - Revocación de refresh tokens en DB (`refresh_tokens`).

3. **Autorización y hardening**
   - Middleware `authenticateToken` para rutas privadas.
   - RBAC vía `authorizeRole` (ADMIN, QUALITY_MANAGER, QUALITY_ANALYST, VIEWER).
   - Zod strict para rechazar campos extra.
   - Prisma ORM evita SQL injection por queries parametrizadas.
   - DOMPurify en frontend para entrada del asistente IA.
   - CSRF mitigado por `SameSite=Strict` + validación de `Origin`.

4. **Audit trail regulatorio**
   - Tabla `audit_logs` con actor, acción, módulo, old/new values, IP, user agent y timestamp.
   - Registro de CREATE/UPDATE/DELETE y uso de asistente IA.
   - Endpoint de lectura `/api/audit` restringido a QUALITY_MANAGER+.

5. **Headers y rate limiting**
   - Helmet con CSP `default-src 'self'`, frameguard deny, HSTS, nosniff, referrer policy.
   - Rate limits generales, de auth y específico IA (10 req/min por usuario).

## Recomendaciones para producción
- Activar TLS extremo a extremo y rotación de secretos.
- Implementar firma digital y controles de e-signature para Part 11 avanzado.
- Integrar SIEM para monitoreo continuo de audit logs.
