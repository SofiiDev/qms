import { prisma } from '../../config/database.js';

async function nextCode(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.desvio.count({ where: { codigo: { startsWith: `DEV-${year}-` } } });
  return `DEV-${year}-${String(count + 1).padStart(3, '0')}`;
}

export const desviosService = {
  list: (page: number, pageSize: number) => prisma.desvio.findMany({ where: { deletedAt: null }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
  getById: (id: string) => prisma.desvio.findFirst({ where: { id, deletedAt: null } }),
  async create(data: any, createdById: string) {
    return prisma.desvio.create({ data: { ...data, codigo: await nextCode(), fechaDeteccion: new Date(data.fechaDeteccion), fechaCierre: data.fechaCierre ? new Date(data.fechaCierre) : null, createdById } });
  },
  update: (id: string, data: any) => prisma.desvio.update({ where: { id }, data: { ...data, fechaDeteccion: data.fechaDeteccion ? new Date(data.fechaDeteccion) : undefined, fechaCierre: data.fechaCierre ? new Date(data.fechaCierre) : undefined } }),
  remove: (id: string) => prisma.desvio.update({ where: { id }, data: { deletedAt: new Date() } }),
  stats: () => prisma.desvio.groupBy({ by: ['estado'], _count: true }),
};
