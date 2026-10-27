import { Response } from 'express';
import { ApiResponse } from '@fieldops/contracts';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: ApiResponse['meta']) {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    meta,
  };
  return res.status(statusCode).json(payload);
}

export function sendCreated<T>(res: Response, data: T, meta?: ApiResponse['meta']) {
  return sendSuccess(res, data, 201, meta);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  return res.status(statusCode).json(payload);
}

