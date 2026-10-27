import { Request, Response } from 'express';
import { customersService, CustomersService } from './customers.service';
import { sendSuccess, sendCreated } from '../../common/http/response';

export class CustomersController {
  constructor(private service: CustomersService = customersService) {}

  list = async (req: Request, res: Response) => {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const customers = await this.service.listCustomers(req.user!.organizationId!, search);
    return sendSuccess(res, customers);
  };

  getById = async (req: Request, res: Response) => {
    const customer = await this.service.getCustomerById(req.params.id as string, req.user!.organizationId!);
    return sendSuccess(res, customer);
  };

  create = async (req: Request, res: Response) => {
    const customer = await this.service.createCustomer(req.user!.organizationId!, req.body);
    return sendCreated(res, customer);
  };
}

export const customersController = new CustomersController();

