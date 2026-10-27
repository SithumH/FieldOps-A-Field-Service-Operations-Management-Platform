import { prisma } from '../../common/database/prisma';
import { CreateWorkOrderInput, WorkOrderStatus, PriorityLevel } from '@fieldops/contracts';

export class WorkOrdersRepository {
  async findById(id: string, organizationId: string) {
    return prisma.workOrder.findFirst({
      where: {
        id,
        customer: {
          organizationId,
        },
      },
      include: {
        customer: true,
        service: true,
        address: true,
        assignments: {
          include: {
            technician: {
              include: {
                user: true,
                skills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            changedBy: true,
          },
        },
        checklists: {
          include: {
            items: true,
          },
        },
        partsUsage: {
          include: {
            inventoryItem: true,
          },
        },
        invoices: true,
      },
    });
  }

  async findByOrganization(
    organizationId: string,
    filters?: { status?: WorkOrderStatus; priority?: PriorityLevel; technicianId?: string },
  ) {
    return prisma.workOrder.findMany({
      where: {
        customer: {
          organizationId,
        },
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.priority ? { priority: filters.priority } : {}),
        ...(filters?.technicianId
          ? {
              assignments: {
                some: {
                  technicianId: filters.technicianId,
                },
              },
            }
          : {}),
      },
      include: {
        customer: true,
        service: true,
        assignments: {
          include: {
            technician: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findConflictingAssignments(
    technicianId: string,
    start: Date,
    end: Date,
    excludeWorkOrderId?: string,
  ) {
    return prisma.workOrderAssignment.findMany({
      where: {
        technicianId,
        ...(excludeWorkOrderId ? { workOrderId: { not: excludeWorkOrderId } } : {}),
        workOrder: {
          status: {
            notIn: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CLOSED, WorkOrderStatus.CANCELLED],
          },
          scheduledStart: {
            lt: end,
          },
          scheduledEnd: {
            gt: start,
          },
        },
      },
      include: {
        workOrder: true,
      },
    });
  }

  async create(_organizationId: string, input: CreateWorkOrderInput, workOrderNumber: string) {
    return prisma.workOrder.create({
      data: {
        workOrderNumber,
        customerId: input.customerId,
        requestId: input.requestId,
        serviceId: input.serviceId,
        addressId: input.addressId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: input.scheduledStart ? WorkOrderStatus.SCHEDULED : WorkOrderStatus.REQUESTED,
        scheduledStart: input.scheduledStart ? new Date(input.scheduledStart) : null,
        scheduledEnd: input.scheduledEnd ? new Date(input.scheduledEnd) : null,
        customerNotes: input.customerNotes,
        internalNotes: input.internalNotes,
      },
      include: {
        customer: true,
        service: true,
      },
    });
  }

  async assignTechnicianInTx(
    workOrderId: string,
    technicianId: string,
    scheduledStart: Date,
    scheduledEnd: Date,
    notes?: string,
    actorId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Update work order status and scheduled window
      const workOrder = await tx.workOrder.update({
        where: { id: workOrderId },
        data: {
          status: WorkOrderStatus.ASSIGNED,
          scheduledStart,
          scheduledEnd,
        },
      });

      // 2. Remove existing assignments for this job and insert new assignment
      await tx.workOrderAssignment.deleteMany({
        where: { workOrderId },
      });

      const assignment = await tx.workOrderAssignment.create({
        data: {
          workOrderId,
          technicianId,
          notes,
        },
        include: {
          technician: {
            include: {
              user: true,
            },
          },
        },
      });

      // 3. Record status transition history
      await tx.workOrderStatusHistory.create({
        data: {
          workOrderId,
          oldStatus: WorkOrderStatus.SCHEDULED,
          newStatus: WorkOrderStatus.ASSIGNED,
          changedById: actorId,
          reason: notes || 'Technician dispatched and assigned',
        },
      });

      return { workOrder, assignment };
    });
  }

  async updateStatusInTx(
    workOrderId: string,
    oldStatus: WorkOrderStatus,
    newStatus: WorkOrderStatus,
    reason?: string,
    actorId?: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = { status: newStatus };
      if (newStatus === WorkOrderStatus.IN_PROGRESS) {
        updateData.actualStart = new Date();
      } else if (newStatus === WorkOrderStatus.COMPLETED) {
        updateData.actualEnd = new Date();
      }

      const workOrder = await tx.workOrder.update({
        where: { id: workOrderId },
        data: updateData,
      });

      await tx.workOrderStatusHistory.create({
        data: {
          workOrderId,
          oldStatus,
          newStatus,
          changedById: actorId,
          reason,
        },
      });

      return workOrder;
    });
  }
}

export const workOrdersRepository = new WorkOrdersRepository();
