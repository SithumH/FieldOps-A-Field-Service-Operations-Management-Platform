import { Request, Response } from 'express';
import { serviceCatalogService, ServiceCatalogService } from './service-catalog.service';
import { sendSuccess, sendCreated } from '../../common/http/response';

export class ServiceCatalogController {
  constructor(private service: ServiceCatalogService = serviceCatalogService) {}

  list = async (req: Request, res: Response) => {
    const items = await this.service.listCatalog(req.user!.organizationId!);
    return sendSuccess(res, items);
  };

  getById = async (req: Request, res: Response) => {
    const item = await this.service.getCatalogItem(req.params.id as string, req.user!.organizationId!);
    return sendSuccess(res, item);
  };

  create = async (req: Request, res: Response) => {
    const item = await this.service.createCatalogItem(req.user!.organizationId!, req.body);
    return sendCreated(res, item);
  };
}

export const serviceCatalogController = new ServiceCatalogController();

