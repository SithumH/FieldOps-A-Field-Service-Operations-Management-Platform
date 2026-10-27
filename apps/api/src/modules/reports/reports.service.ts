import { prisma } from '../../common/database/prisma';
import { WorkOrderStatus, InvoiceStatus } from '@fieldops/contracts';

export class ReportsService {
  async getOperationsReport(organizationId: string) {
    const [
      totalWorkOrders,
      activeWorkOrders,
      completedWorkOrders,
      workOrdersByStatus,
      totalCustomers,
      invoices,
      lowStockItems,
    ] = await Promise.all([
      prisma.workOrder.count({
        where: { customer: { organizationId } },
      }),
      prisma.workOrder.count({
        where: {
          customer: { organizationId },
          status: { in: [WorkOrderStatus.SCHEDULED, WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS] },
        },
      }),
      prisma.workOrder.count({
        where: {
          customer: { organizationId },
          status: WorkOrderStatus.COMPLETED,
        },
      }),
      prisma.workOrder.groupBy({
        by: ['status'],
        where: { customer: { organizationId } },
        _count: { status: true },
      }),
      prisma.customer.count({
        where: { organizationId },
      }),
      prisma.invoice.findMany({
        where: { workOrder: { customer: { organizationId } } },
        select: { status: true, total: true },
      }),
      prisma.inventoryItem.findMany({
        where: {
          organizationId,
          quantityOnHand: { lte: 5 },
        },
        select: { id: true, sku: true, name: true, quantityOnHand: true, reorderLevel: true },
      }),
    ]);

    const totalRevenueBilled = invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
    const totalRevenuePaid = invoices
      .filter((inv) => inv.status === InvoiceStatus.PAID)
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    return {
      workOrders: {
        total: totalWorkOrders,
        active: activeWorkOrders,
        completed: completedWorkOrders,
        byStatus: workOrdersByStatus.reduce((acc, curr) => {
          acc[curr.status] = curr._count.status;
          return acc;
        }, {} as Record<string, number>),
      },
      customers: {
        total: totalCustomers,
      },
      finances: {
        totalBilled: totalRevenueBilled,
        totalPaid: totalRevenuePaid,
        pendingSettlement: totalRevenueBilled - totalRevenuePaid,
      },
      inventoryAlerts: {
        lowStockCount: lowStockItems.length,
        items: lowStockItems,
      },
    };
  }
}

export const reportsService = new ReportsService();

