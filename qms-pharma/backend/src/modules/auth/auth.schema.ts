import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(12)
  .regex(/[A-Z]/, 'Debe incluir mayúscula')
  .regex(/[0-9]/, 'Debe incluir número')
  .regex(/[^A-Za-z0-9]/, 'Debe incluir caracter especial');

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    fullName: z.string().min(3),
    role: z.enum(['ADMIN', 'QUALITY_MANAGER', 'QUALITY_ANALYST', 'VIEWER']),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict();
