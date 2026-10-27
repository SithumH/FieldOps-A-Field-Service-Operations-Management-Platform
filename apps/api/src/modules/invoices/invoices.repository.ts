import { prisma } from '../../common/database/prisma';
import { InvoiceStatus, PaymentMethod, PaymentStatus, WorkOrderStatus } from '@fieldops/contracts';
import { Prisma } from '@prisma/client';

export class InvoicesRepository {
  async findById(id: string, organizationId: string) {
    return prisma.invoice.findFirst({
      where: {
        id,
        workOrder: {
          customer: {
            organizationId,
          },
        },
      },
      include: {
        workOrder: {
          include: {
            customer: true,
            service: true,
          },
        },
        items: true,
        payments: true,
      },
    });
  }

  async findByOrganization(organizationId: string) {
    return prisma.invoice.findMany({
      where: {
        workOrder: {
          customer: {
            organizationId,
          },
        },
      },
      include: {
        workOrder: {
          include: {
            customer: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createInvoiceInTx(
    workOrderId: string,
    invoiceNumber: string,
    subtotal: Prisma.Decimal,
    taxRate: Prisma.Decimal,
    tax: Prisma.Decimal,
    total: Prisma.Decimal,
    items: { description: string; quantity: number; unitPrice: Prisma.Decimal; totalPrice: Prisma.Decimal }[],
    dueDate?: Date,
    actorId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Create invoice header
      const invoice = await tx.invoice.create({
        data: {
          workOrderId,
          invoiceNumber,
          status: InvoiceStatus.ISSUED,
          subtotal,
          taxRate,
          tax,
          total,
          dueDate,
          issuedAt: new Date(),
          items: {
            create: items,
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Transition work order status to INVOICED
      await tx.workOrder.update({
        where: { id: workOrderId },
        data: { status: WorkOrderStatus.INVOICED },
      });

      // 3. Log work order status history
      await tx.workOrderStatusHistory.create({
        data: {
          workOrderId,
          oldStatus: WorkOrderStatus.COMPLETED,
          newStatus: WorkOrderStatus.INVOICED,
          changedById: actorId,
          reason: `Invoice ${invoiceNumber} generated for amount $${total.toFixed(2)}`,
        },
      });

      return invoice;
    });
  }

  async recordPaymentInTx(
    invoiceId: string,
    amount: Prisma.Decimal,
    method: PaymentMethod,
    reference?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          payments: true,
          workOrder: true,
        },
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Record payment
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount,
          method,
          status: PaymentStatus.COMPLETED,
          reference,
        },
      });

      // Calculate total paid so far
      const totalPaid = invoice.payments
        .filter((p) => p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum.add(p.amount), new Prisma.Decimal(0))
        .add(amount);

      // Check if invoice is fully settled
      const isSettled = totalPaid.gte(invoice.total);

      if (isSettled) {
        await tx.invoice.update({
          where: { id: invoiceId },
          data: { status: InvoiceStatus.PAID },
        });

        // Close work order
        await tx.workOrder.update({
          where: { id: invoice.workOrderId },
          data: { status: WorkOrderStatus.CLOSED },
        });

        await tx.workOrderStatusHistory.create({
          data: {
            workOrderId: invoice.workOrderId,
            oldStatus: WorkOrderStatus.INVOICED,
            newStatus: WorkOrderStatus.CLOSED,
            reason: `Payment settled in full ($${totalPaid.toFixed(2)} / $${invoice.total.toFixed(2)})`,
          },
        });
      }

      return { payment, isSettled };
    });
  }
}

export const invoicesRepository = new InvoicesRepository();

