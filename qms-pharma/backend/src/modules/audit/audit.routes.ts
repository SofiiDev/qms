import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { authenticateToken } from '../../middleware/authenticate.js';
import { authorizeRole } from '../../middleware/authorize.js';

export const auditRouter = Router();

auditRouter.use(authenticateToken, authorizeRole(['QUALITY_MANAGER']));
auditRouter.get('/', async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 50);
  const logs = await prisma.auditLog.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { timestamp: 'desc' },
    include: { user: { select: { email: true, fullName: true, role: true } } },
  });
  res.json(logs);
});
