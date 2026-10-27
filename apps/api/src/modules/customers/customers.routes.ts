import { Router } from 'express';
import { customersController } from './customers.controller';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { createCustomerSchema, UserRole } from '@fieldops/contracts';

export const customersRouter = Router();

customersRouter.use(requireAuth, enforceTenant);

customersRouter.get(
  '/customers',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.FINANCE),
  customersController.list,
);

customersRouter.get(
  '/customers/:id',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.FINANCE),
  customersController.getById,
);

customersRouter.post(
  '/customers',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER),
  validateBody(createCustomerSchema),
  customersController.create,
);

