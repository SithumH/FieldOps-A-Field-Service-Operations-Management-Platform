import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../common/errors/app-error';
import { sendError } from '../common/http/response';
import { logger } from '../common/logging/logger';
import { env } from '../config/env';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error('Unhandled or captured error:', err.message);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return sendError(res, 422, 'VALIDATION_ERROR', 'Request validation failed', formattedErrors);
  }

  // Fallback for unhandled unexpected runtime errors
  const isProd = env.NODE_ENV === 'production';
  return sendError(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    isProd ? 'An unexpected error occurred on the server' : err.message,
    isProd ? undefined : err.stack,
  );
}

