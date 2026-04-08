import { prisma } from '../config/database.js';

interface AuditInput {
  userId?: string;
  action: string;
  module: string;
  recordId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(input: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      module: input.module,
      recordId: input.recordId,
      oldValue: input.oldValue as never,
      newValue: input.newValue as never,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    },
  });
}
