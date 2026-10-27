import { Router } from 'express';
import { reportsController } from './reports.controller';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { UserRole } from '@fieldops/contracts';

export const reportsRouter = Router();

reportsRouter.use(requireAuth, enforceTenant);

reportsRouter.get(
  '/reports/operations',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.FINANCE),
  reportsController.getOperationsReport,
);

