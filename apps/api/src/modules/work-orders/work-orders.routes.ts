import { Router } from 'express';
import { workOrdersController } from './work-orders.controller';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import {
  createWorkOrderSchema,
  assignTechnicianSchema,
  rescheduleWorkOrderSchema,
  updateWorkOrderStatusSchema,
  UserRole,
} from '@fieldops/contracts';

export const workOrdersRouter = Router();

workOrdersRouter.use(requireAuth, enforceTenant);

workOrdersRouter.get('/work-orders', workOrdersController.list);
workOrdersRouter.get('/work-orders/:id', workOrdersController.getById);

workOrdersRouter.post(
  '/work-orders',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER),
  validateBody(createWorkOrderSchema),
  workOrdersController.create,
);

workOrdersRouter.post(
  '/work-orders/:id/assign',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER),
  validateBody(assignTechnicianSchema),
  workOrdersController.assignTechnician,
);

workOrdersRouter.post(
  '/work-orders/:id/reschedule',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER),
  validateBody(rescheduleWorkOrderSchema),
  workOrdersController.reschedule,
);

workOrdersRouter.patch(
  '/work-orders/:id/status',
  validateBody(updateWorkOrderStatusSchema),
  workOrdersController.updateStatus,
);

workOrdersRouter.post(
  '/work-orders/:id/start',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.TECHNICIAN),
  workOrdersController.startJob,
);

workOrdersRouter.post(
  '/work-orders/:id/complete',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.TECHNICIAN),
  workOrdersController.completeJob,
);

