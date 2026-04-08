import { prisma } from '../../config/database.js';

async function nextCode(tipo: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${tipo}-${year}-`;
  const count = await prisma.documento.count({ where: { codigo: { startsWith: prefix } } });
  return `${prefix}${String(count + 1).padStart(3, '0')}`;
}

export const documentosService = {
  list: () => prisma.documento.findMany({ where: { deletedAt: null }, include: { parentDocumento: true, children: true }, orderBy: { createdAt: 'desc' } }),
  getById: (id: string) => prisma.documento.findFirst({ where: { id, deletedAt: null }, include: { parentDocumento: true, children: true } }),
  async create(data: any, createdById: string) { return prisma.documento.create({ data: { ...data, codigo: data.codigo ?? await nextCode(data.tipo), fechaAprobacion: data.fechaAprobacion ? new Date(data.fechaAprobacion) : null, contenido: data.contenido, createdById } }); },
  update: (id: string, data: any) => prisma.documento.update({ where: { id }, data: { ...data, fechaAprobacion: data.fechaAprobacion ? new Date(data.fechaAprobacion) : undefined } }),
  remove: (id: string) => prisma.documento.update({ where: { id }, data: { deletedAt: new Date() } }),
};
