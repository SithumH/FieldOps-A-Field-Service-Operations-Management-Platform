import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import {
  createInventoryItemSchema,
  recordPartsUsageSchema,
  UserRole,
} from '@fieldops/contracts';

export const inventoryRouter = Router();

inventoryRouter.use(requireAuth, enforceTenant);

inventoryRouter.get('/inventory', inventoryController.list);

inventoryRouter.post(
  '/inventory',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER),
  validateBody(createInventoryItemSchema),
  inventoryController.create,
);

inventoryRouter.post(
  '/work-orders/:id/parts',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.TECHNICIAN),
  validateBody(recordPartsUsageSchema),
  inventoryController.recordPartsUsage,
);

