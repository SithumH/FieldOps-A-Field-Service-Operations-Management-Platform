import { Request, Response } from 'express';
import { reportsService, ReportsService } from './reports.service';
import { sendSuccess } from '../../common/http/response';

export class ReportsController {
  constructor(private service: ReportsService = reportsService) {}

  getOperationsReport = async (req: Request, res: Response) => {
    const report = await this.service.getOperationsReport(req.user!.organizationId!);
    return sendSuccess(res, report);
  };
}

export const reportsController = new ReportsController();

