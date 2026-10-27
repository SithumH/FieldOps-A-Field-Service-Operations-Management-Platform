import { Router } from 'express';
import { serviceRequestsController } from './service-requests.controller';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import {
  createServiceRequestSchema,
  updateServiceRequestStatusSchema,
  UserRole,
} from '@fieldops/contracts';

export const serviceRequestsRouter = Router();

serviceRequestsRouter.use(requireAuth, enforceTenant);

serviceRequestsRouter.get('/service-requests', serviceRequestsController.list);
serviceRequestsRouter.get('/service-requests/:id', serviceRequestsController.getById);

serviceRequestsRouter.post(
  '/service-requests',
  validateBody(createServiceRequestSchema),
  serviceRequestsController.create,
);

serviceRequestsRouter.patch(
  '/service-requests/:id/status',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER),
  validateBody(updateServiceRequestStatusSchema),
  serviceRequestsController.updateStatus,
);

