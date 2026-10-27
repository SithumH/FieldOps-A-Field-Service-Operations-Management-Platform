import { Request, Response } from 'express';
import { sendSuccess } from '../../common/http/response';

export function getHealthStatus(_req: Request, res: Response) {
  const healthData = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'fieldops-api',
  };

  return sendSuccess(res, healthData);
}

