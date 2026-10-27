import { Request, Response } from 'express';
import { invoicesService, InvoicesService } from './invoices.service';
import { sendSuccess, sendCreated } from '../../common/http/response';

export class InvoicesController {
  constructor(private service: InvoicesService = invoicesService) {}

  list = async (req: Request, res: Response) => {
    const invoices = await this.service.listInvoices(req.user!.organizationId!);
    return sendSuccess(res, invoices);
  };

  getById = async (req: Request, res: Response) => {
    const invoice = await this.service.getInvoiceById(
      req.params.id as string,
      req.user!.organizationId!,
    );
    return sendSuccess(res, invoice);
  };

  generate = async (req: Request, res: Response) => {
    const invoice = await this.service.generateInvoice(
      req.params.id as string,
      req.user!.organizationId!,
      req.body,
      req.user!.id,
    );
    return sendCreated(res, invoice);
  };

  recordPayment = async (req: Request, res: Response) => {
    const paymentResult = await this.service.recordPayment(
      req.params.id as string,
      req.user!.organizationId!,
      req.body,
    );
    return sendCreated(res, paymentResult);
  };
}

export const invoicesController = new InvoicesController();

