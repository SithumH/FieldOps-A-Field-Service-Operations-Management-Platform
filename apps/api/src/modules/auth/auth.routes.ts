import { Router } from 'express';
import { authController } from './auth.controller';
import { validateBody } from '../../middleware/validate.middleware';
import { requireAuth } from '../../middleware/auth.middleware';
import { loginSchema, registerOrganizationSchema } from '@fieldops/contracts';

export const authRouter = Router();

authRouter.post('/auth/login', validateBody(loginSchema), authController.login);
authRouter.post(
  '/auth/register-organization',
  validateBody(registerOrganizationSchema),
  authController.registerOrganization,
);
authRouter.post('/auth/logout', authController.logout);
authRouter.get('/auth/me', requireAuth, authController.me);

