import { z } from 'zod';

export const createCapaSchema = z.object({
  codigo: z.string().optional(),
  tipo: z.enum(['CORRECTIVA', 'PREVENTIVA']),
  descripcion: z.string().min(10),
  origen: z.enum(['DESVIO', 'CAMBIO', 'AUDITORIA', 'RIESGO']),
  origenId: z.string().min(1),
  responsable: z.string().min(3),
  fechaCompromiso: z.string().datetime(),
  fechaCierre: z.string().datetime().optional(),
  efectividad: z.string().optional(),
  estado: z.string().min(2),
}).strict();

export const updateCapaSchema = createCapaSchema.partial().strict();
