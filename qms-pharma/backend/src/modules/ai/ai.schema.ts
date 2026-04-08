import { z } from 'zod';

export const aiAssistSchema = z.object({
  module: z.string().min(2),
  action: z.string().min(2),
  context: z.record(z.any()),
}).strict();
