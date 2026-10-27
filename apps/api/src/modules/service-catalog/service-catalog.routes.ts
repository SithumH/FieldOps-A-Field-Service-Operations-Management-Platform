import { Router } from 'express';
import { serviceCatalogController } from './service-catalog.controller';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { createServiceCatalogItemSchema, UserRole } from '@fieldops/contracts';

export const serviceCatalogRouter = Router();

serviceCatalogRouter.use(requireAuth, enforceTenant);

serviceCatalogRouter.get('/service-catalog', serviceCatalogController.list);
serviceCatalogRouter.get('/service-catalog/:id', serviceCatalogController.getById);

serviceCatalogRouter.post(
  '/service-catalog',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER),
  validateBody(createServiceCatalogItemSchema),
  serviceCatalogController.create,
);

