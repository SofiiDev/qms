import { z } from 'zod';

const score = z.number().int().min(1).max(10);

export const createRiesgoSchema = z.object({
  codigo: z.string().min(3).optional(),
  proceso: z.string().min(2),
  modoFalla: z.string().min(3),
  efecto: z.string().min(3),
  causa: z.string().min(3),
  severidad: score,
  ocurrencia: score,
  detectabilidad: score,
  controlesActuales: z.string().min(3),
  accionesRecomendadas: z.string().min(3),
  responsable: z.string().min(2),
  estado: z.string().min(2),
}).strict();

export const updateRiesgoSchema = createRiesgoSchema.partial().strict();
