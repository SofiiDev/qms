import { z } from 'zod';

export const createDesvioSchema = z.object({
  descripcion: z.string().min(10),
  clasificacion: z.enum(['CRITICO', 'MAYOR', 'MENOR']),
  producto: z.string().min(2),
  lote: z.string().min(2),
  causaRaiz: z.string().optional(),
  estado: z.enum(['ABIERTO', 'EN_INVESTIGACION', 'CERRADO']).optional(),
  responsableId: z.string().optional(),
  fechaDeteccion: z.string().datetime(),
  fechaCierre: z.string().datetime().optional(),
  capaId: z.string().optional(),
}).strict();

export const updateDesvioSchema = createDesvioSchema.partial().strict();
