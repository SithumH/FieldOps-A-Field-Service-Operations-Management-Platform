import { invoicesRepository, InvoicesRepository } from './invoices.repository';
import { workOrdersRepository, WorkOrdersRepository } from '../work-orders/work-orders.repository';
import { GenerateInvoiceInput, RecordPaymentInput, WorkOrderStatus, PaymentMethod } from '@fieldops/contracts';
import { BadRequestError, NotFoundError } from '../../common/errors/app-error';
import { Prisma } from '@prisma/client';

export class InvoicesService {
  constructor(
    private repo: InvoicesRepository = invoicesRepository,
    private workOrderRepo: WorkOrdersRepository = workOrdersRepository,
  ) {}

  async listInvoices(organizationId: string) {
    return this.repo.findByOrganization(organizationId);
  }

  async getInvoiceById(id: string, organizationId: string) {
    const invoice = await this.repo.findById(id, organizationId);
    if (!invoice) {
      throw new NotFoundError('Invoice not found in your organization');
    }
    return invoice;
  }

  async generateInvoice(
    workOrderId: string,
    organizationId: string,
    input: GenerateInvoiceInput,
    actorId?: string,
  ) {
    const workOrder = await this.workOrderRepo.findById(workOrderId, organizationId);
    if (!workOrder) {
      throw new NotFoundError('Work order not found');
    }

    if (workOrder.status !== WorkOrderStatus.COMPLETED) {
      throw new BadRequestError(
        `Invoices can only be generated for COMPLETED work orders. Current status: ${workOrder.status}`,
      );
    }

    if (workOrder.invoices.length > 0) {
      throw new BadRequestError('An invoice has already been generated for this work order');
    }

    const items: {
      description: string;
      quantity: number;
      unitPrice: Prisma.Decimal;
      totalPrice: Prisma.Decimal;
    }[] = [];

    let subtotal = new Prisma.Decimal(0);

    // 1. Add Labor / Service Diagnostic Base Line Item
    if (workOrder.service && workOrder.service.basePrice.gt(0)) {
      items.push({
        description: `Service Labor: ${workOrder.service.name}`,
        quantity: 1,
        unitPrice: workOrder.service.basePrice,
        totalPrice: workOrder.service.basePrice,
      });
      subtotal = subtotal.add(workOrder.service.basePrice);
    }

    // 2. Add Parts Line Items from parts usage
    for (const part of workOrder.partsUsage) {
      const lineTotal = part.unitPrice.mul(part.quantity);
      items.push({
        description: `Part: ${part.inventoryItem.name} (${part.inventoryItem.sku})`,
        quantity: part.quantity,
        unitPrice: part.unitPrice,
        totalPrice: lineTotal,
      });
      subtotal = subtotal.add(lineTotal);
    }

    const taxRate = new Prisma.Decimal(input.taxRate || 0);
    const tax = subtotal.mul(taxRate).div(100);
    const total = subtotal.add(tax);

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dueDate = input.dueDate ? new Date(input.dueDate) : undefined;

    return this.repo.createInvoiceInTx(
      workOrderId,
      invoiceNumber,
      subtotal,
      taxRate,
      tax,
      total,
      items,
      dueDate,
      actorId,
    );
  }

  async recordPayment(
    invoiceId: string,
    organizationId: string,
    input: RecordPaymentInput,
  ) {
    const invoice = await this.repo.findById(invoiceId, organizationId);
    if (!invoice) {
      throw new NotFoundError('Invoice not found in your organization');
    }

    const paymentAmount = new Prisma.Decimal(input.amount);
    return this.repo.recordPaymentInTx(
      invoiceId,
      paymentAmount,
      input.method as PaymentMethod,
      input.reference,
    );
  }
}

export const invoicesService = new InvoicesService();

