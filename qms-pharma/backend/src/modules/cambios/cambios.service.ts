import { prisma } from '../../config/database.js';

async function nextCode(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.cambio.count({ where: { codigo: { startsWith: `CC-${year}-` } } });
  return `CC-${year}-${String(count + 1).padStart(3, '0')}`;
}

export const cambiosService = {
  list: () => prisma.cambio.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }),
  getById: (id: string) => prisma.cambio.findFirst({ where: { id, deletedAt: null } }),
  async create(data: any, createdById: string) { return prisma.cambio.create({ data: { ...data, codigo: await nextCode(), fechaAprobacion: data.fechaAprobacion ? new Date(data.fechaAprobacion) : null, sistemasAfectados: data.sistemasAfectados, createdById } }); },
  update: (id: string, data: any) => prisma.cambio.update({ where: { id }, data: { ...data, fechaAprobacion: data.fechaAprobacion ? new Date(data.fechaAprobacion) : undefined } }),
  remove: (id: string) => prisma.cambio.update({ where: { id }, data: { deletedAt: new Date() } }),
};
