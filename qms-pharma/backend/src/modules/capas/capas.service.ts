import { prisma } from '../../config/database.js';

async function nextCode(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.capa.count({ where: { codigo: { startsWith: `CAPA-${year}-` } } });
  return `CAPA-${year}-${String(count + 1).padStart(3, '0')}`;
}

export const capasService = {
  list: () => prisma.capa.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }),
  getById: (id: string) => prisma.capa.findFirst({ where: { id, deletedAt: null } }),
  async create(data: any, createdById: string) { return prisma.capa.create({ data: { ...data, codigo: data.codigo ?? await nextCode(), fechaCompromiso: new Date(data.fechaCompromiso), fechaCierre: data.fechaCierre ? new Date(data.fechaCierre) : null, createdById } }); },
  update: (id: string, data: any) => prisma.capa.update({ where: { id }, data: { ...data, fechaCompromiso: data.fechaCompromiso ? new Date(data.fechaCompromiso) : undefined, fechaCierre: data.fechaCierre ? new Date(data.fechaCierre) : undefined } }),
  remove: (id: string) => prisma.capa.update({ where: { id }, data: { deletedAt: new Date() } }),
};
