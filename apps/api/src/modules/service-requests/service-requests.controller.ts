import { Request, Response } from 'express';
import { serviceRequestsService, ServiceRequestsService } from './service-requests.service';
import { sendSuccess, sendCreated } from '../../common/http/response';
import { ServiceRequestStatus } from '@fieldops/contracts';

export class ServiceRequestsController {
  constructor(private service: ServiceRequestsService = serviceRequestsService) {}

  list = async (req: Request, res: Response) => {
    const status = req.query.status as ServiceRequestStatus | undefined;
    const requests = await this.service.listRequests(req.user!.organizationId!, status);
    return sendSuccess(res, requests);
  };

  getById = async (req: Request, res: Response) => {
    const request = await this.service.getRequestById(
      req.params.id as string,
      req.user!.organizationId!,
    );
    return sendSuccess(res, request);
  };

  create = async (req: Request, res: Response) => {
    const request = await this.service.createRequest(req.user!.organizationId!, req.body);
    return sendCreated(res, request);
  };

  updateStatus = async (req: Request, res: Response) => {
    const updated = await this.service.updateRequestStatus(
      req.params.id as string,
      req.user!.organizationId!,
      req.body,
    );
    return sendSuccess(res, updated);
  };
}

export const serviceRequestsController = new ServiceRequestsController();

