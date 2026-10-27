import { Router } from 'express';
import { invoicesController } from './invoices.controller';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import {
  generateInvoiceSchema,
  recordPaymentSchema,
  UserRole,
} from '@fieldops/contracts';

export const invoicesRouter = Router();

invoicesRouter.use(requireAuth, enforceTenant);

invoicesRouter.get(
  '/invoices',
  requireRole(UserRole.ORG_ADMIN, UserRole.FINANCE, UserRole.DISPATCHER),
  invoicesController.list,
);

invoicesRouter.get(
  '/invoices/:id',
  requireRole(UserRole.ORG_ADMIN, UserRole.FINANCE, UserRole.DISPATCHER, UserRole.CUSTOMER),
  invoicesController.getById,
);

invoicesRouter.post(
  '/work-orders/:id/invoice',
  requireRole(UserRole.ORG_ADMIN, UserRole.FINANCE, UserRole.DISPATCHER),
  validateBody(generateInvoiceSchema),
  invoicesController.generate,
);

invoicesRouter.post(
  '/invoices/:id/payments',
  requireRole(UserRole.ORG_ADMIN, UserRole.FINANCE, UserRole.CUSTOMER),
  validateBody(recordPaymentSchema),
  invoicesController.recordPayment,
);

