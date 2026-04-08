import { prisma } from '../../config/database.js';

function npr(data: any): number {
  return data.severidad * data.ocurrencia * data.detectabilidad;
}

async function nextCode(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.riesgo.count({ where: { codigo: { startsWith: `RISK-${year}-` } } });
  return `RISK-${year}-${String(count + 1).padStart(3, '0')}`;
}

export const riesgosService = {
  list: () => prisma.riesgo.findMany({ where: { deletedAt: null }, orderBy: { npr: 'desc' } }),
  getById: (id: string) => prisma.riesgo.findFirst({ where: { id, deletedAt: null } }),
  async create(data: any, createdById: string) { return prisma.riesgo.create({ data: { ...data, codigo: data.codigo ?? await nextCode(), npr: npr(data), createdById } }); },
  update: async (id: string, data: any) => { const current = await prisma.riesgo.findUniqueOrThrow({ where: { id } }); const merged = { ...current, ...data }; return prisma.riesgo.update({ where: { id }, data: { ...data, npr: npr(merged) } }); },
  remove: (id: string) => prisma.riesgo.update({ where: { id }, data: { deletedAt: new Date() } }),
};
