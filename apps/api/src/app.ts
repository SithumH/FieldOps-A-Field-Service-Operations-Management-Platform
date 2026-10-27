import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { healthRouter } from './modules/health/health.routes';
import { authRouter } from './modules/auth/auth.routes';
import { customersRouter } from './modules/customers/customers.routes';
import { serviceCatalogRouter } from './modules/service-catalog/service-catalog.routes';
import { serviceRequestsRouter } from './modules/service-requests/service-requests.routes';
import { workOrdersRouter } from './modules/work-orders/work-orders.routes';
import { inventoryRouter } from './modules/inventory/inventory.routes';
import { invoicesRouter } from './modules/invoices/invoices.routes';
import { checklistsRouter } from './modules/checklists/checklists.routes';
import { reportsRouter } from './modules/reports/reports.routes';
import { authenticateSession } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import { NotFoundError } from './common/errors/app-error';

export function createApp() {
  const app = express();

  // Security headers & CORS
  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Body parsing and session cookie parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.SESSION_SECRET));

  // Authentication session deserialization middleware
  app.use(authenticateSession);

  // Base and Versioned API routes
  app.use(healthRouter);
  app.use(env.API_PREFIX, healthRouter);
  app.use(env.API_PREFIX, authRouter);
  app.use(env.API_PREFIX, customersRouter);
  app.use(env.API_PREFIX, serviceCatalogRouter);
  app.use(env.API_PREFIX, serviceRequestsRouter);
  app.use(env.API_PREFIX, workOrdersRouter);
  app.use(env.API_PREFIX, inventoryRouter);
  app.use(env.API_PREFIX, invoicesRouter);
  app.use(env.API_PREFIX, checklistsRouter);
  app.use(env.API_PREFIX, reportsRouter);

  // Catch-all 404 handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError('The requested endpoint was not found on this server'));
  });

  // Global centralized error middleware
  app.use(errorHandler);

  return app;
}

