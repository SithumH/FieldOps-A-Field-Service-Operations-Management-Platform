import { Router } from 'express';
import { getHealthStatus } from './health.controller';

export const healthRouter = Router();

healthRouter.get('/health', getHealthStatus);

