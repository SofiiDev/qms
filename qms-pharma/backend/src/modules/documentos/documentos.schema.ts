import { z } from 'zod';

export const createDocumentoSchema = z.object({
  codigo: z.string().optional(),
  tipo: z.enum(['URS', 'DQ', 'IQ', 'OQ', 'PQ']),
  titulo: z.string().min(3),
  sistema: z.string().min(2),
  categoriaGamp: z.union([z.literal(1), z.literal(3), z.literal(4), z.literal(5)]),
  revision: z.string().min(1),
  estado: z.enum(['BORRADOR', 'REVISION', 'APROBADO']).optional(),
  contenido: z.union([z.string(), z.record(z.any())]),
  parentDocumentoId: z.string().optional(),
  aprobadoPor: z.string().optional(),
  fechaAprobacion: z.string().datetime().optional(),
}).strict();

export const updateDocumentoSchema = createDocumentoSchema.partial().strict();
