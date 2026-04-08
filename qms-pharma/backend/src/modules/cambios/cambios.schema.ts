import { z } from 'zod';

export const createCambioSchema = z.object({
  descripcion: z.string().min(10),
  tipo: z.enum(['MAYOR', 'MENOR', 'CRITICO']),
  justificacion: z.string().min(10),
  impactoGmp: z.string().min(5),
  sistemasAfectados: z.array(z.string().min(2)),
  estado: z.enum(['BORRADOR', 'EVALUACION', 'APROBADO', 'RECHAZADO', 'IMPLEMENTADO']).optional(),
  aprobadoPor: z.string().optional(),
  fechaAprobacion: z.string().datetime().optional(),
  planRevalidacion: z.string().optional(),
}).strict();

export const updateCambioSchema = createCambioSchema.partial().strict();
