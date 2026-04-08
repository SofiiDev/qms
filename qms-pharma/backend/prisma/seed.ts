import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin1234!Secure', 12);
  const managerPassword = await bcrypt.hash('Manager1234!Secure', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@qmspharma.local' },
    update: {},
    create: {
      email: 'admin@qmspharma.local',
      fullName: 'Administrador QMS',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@qmspharma.local' },
    update: {},
    create: {
      email: 'manager@qmspharma.local',
      fullName: 'Quality Manager',
      passwordHash: managerPassword,
      role: Role.QUALITY_MANAGER,
    },
  });

  await prisma.desvio.create({
    data: {
      codigo: 'DEV-2026-001',
      descripcion: 'Temperatura fuera de rango en depósito de insumos.',
      clasificacion: 'MAYOR',
      producto: 'Paracetamol 500mg',
      lote: 'PCT26001',
      causaRaiz: 'Falla en sensor de temperatura.',
      estado: 'EN_INVESTIGACION',
      fechaDeteccion: new Date('2026-03-20T10:00:00Z'),
      createdById: manager.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SEED_INIT',
      module: 'SYSTEM',
      newValue: { note: 'Seed data initialized' },
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
