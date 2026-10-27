import { workOrdersRepository, WorkOrdersRepository } from './work-orders.repository';
import { customersRepository, CustomersRepository } from '../customers/customers.repository';
import { prisma } from '../../common/database/prisma';
import { validateStatusTransition } from './work-orders.state-machine';
import {
  CreateWorkOrderInput,
  AssignTechnicianInput,
  RescheduleWorkOrderInput,
  WorkOrderStatus,
  PriorityLevel,
} from '@fieldops/contracts';
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from '../../common/errors/app-error';

export class WorkOrdersService {
  constructor(
    private repo: WorkOrdersRepository = workOrdersRepository,
    private customerRepo: CustomersRepository = customersRepository,
  ) {}

  async listWorkOrders(
    organizationId: string,
    filters?: { status?: WorkOrderStatus; priority?: PriorityLevel; technicianId?: string },
  ) {
    return this.repo.findByOrganization(organizationId, filters);
  }

  async getWorkOrderById(id: string, organizationId: string) {
    const workOrder = await this.repo.findById(id, organizationId);
    if (!workOrder) {
      throw new NotFoundError('Work order not found in your organization');
    }
    return workOrder;
  }

  async createWorkOrder(organizationId: string, input: CreateWorkOrderInput) {
    const customer = await this.customerRepo.findById(input.customerId, organizationId);
    if (!customer) {
      throw new NotFoundError('Customer not found in this organization');
    }

    if (input.scheduledStart && input.scheduledEnd) {
      const start = new Date(input.scheduledStart);
      const end = new Date(input.scheduledEnd);
      if (start >= end) {
        throw new BadRequestError('Scheduled end time must be after scheduled start time');
      }
    }

    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const workOrderNumber = `WO-${new Date().getFullYear()}-${uniqueSuffix}`;

    return this.repo.create(organizationId, input, workOrderNumber);
  }

  async assignTechnician(
    workOrderId: string,
    organizationId: string,
    input: AssignTechnicianInput,
    actorId?: string,
  ) {
    const workOrder = await this.repo.findById(workOrderId, organizationId);
    if (!workOrder) {
      throw new NotFoundError('Work order not found in your organization');
    }

    const start = new Date(input.scheduledStart);
    const end = new Date(input.scheduledEnd);

    if (start >= end) {
      throw new BadRequestError('Scheduled end time must be strictly after scheduled start time');
    }

    // Check technician exists, belongs to tenant, and is available
    const technician = await prisma.technicianProfile.findFirst({
      where: {
        id: input.technicianId,
        user: {
          organizationId,
        },
      },
      include: {
        user: true,
      },
    });

    if (!technician) {
      throw new NotFoundError('Technician profile not found in your organization');
    }

    if (!technician.isAvailable) {
      throw new BadRequestError(`Technician ${technician.user.firstName} ${technician.user.lastName} is currently set as unavailable`);
    }

    // Conflict prevention check: find overlapping appointments
    const conflicts = await this.repo.findConflictingAssignments(
      input.technicianId,
      start,
      end,
      workOrderId,
    );

    if (conflicts.length > 0) {
      const conflictJob = conflicts[0]!.workOrder;
      throw new ConflictError(
        `Scheduling Conflict: Technician ${technician.user.firstName} is already assigned to ${conflictJob.workOrderNumber} (${conflictJob.scheduledStart?.toISOString()} to ${conflictJob.scheduledEnd?.toISOString()})`,
        { conflictingWorkOrderId: conflictJob.id, conflictingWorkOrderNumber: conflictJob.workOrderNumber },
      );
    }

    return this.repo.assignTechnicianInTx(
      workOrderId,
      input.technicianId,
      start,
      end,
      input.notes,
      actorId,
    );
  }

  async rescheduleWorkOrder(
    workOrderId: string,
    organizationId: string,
    input: RescheduleWorkOrderInput,
    actorId?: string,
  ) {
    const workOrder = await this.repo.findById(workOrderId, organizationId);
    if (!workOrder) {
      throw new NotFoundError('Work order not found');
    }

    if (
      workOrder.status === WorkOrderStatus.COMPLETED ||
      workOrder.status === WorkOrderStatus.CLOSED ||
      workOrder.status === WorkOrderStatus.CANCELLED
    ) {
      throw new BadRequestError(`Cannot reschedule work order with status ${workOrder.status}`);
    }

    const start = new Date(input.scheduledStart);
    const end = new Date(input.scheduledEnd);

    if (start >= end) {
      throw new BadRequestError('Scheduled end time must be after start time');
    }

    // If a technician is currently assigned, ensure the new window has no conflict
    const currentAssignment = workOrder.assignments[0];
    if (currentAssignment) {
      const conflicts = await this.repo.findConflictingAssignments(
        currentAssignment.technicianId,
        start,
        end,
        workOrderId,
      );

      if (conflicts.length > 0) {
        throw new ConflictError(
          'Technician has an existing appointment during the new requested reschedule window',
        );
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.workOrder.update({
        where: { id: workOrderId },
        data: {
          scheduledStart: start,
          scheduledEnd: end,
        },
      });

      await tx.workOrderStatusHistory.create({
        data: {
          workOrderId,
          oldStatus: workOrder.status,
          newStatus: workOrder.status,
          changedById: actorId,
          reason: `Rescheduled: ${input.reason}`,
        },
      });

      return updated;
    });
  }

  async updateStatus(
    workOrderId: string,
    organizationId: string,
    nextStatus: WorkOrderStatus,
    reason?: string,
    actorId?: string,
  ) {
    const workOrder = await this.repo.findById(workOrderId, organizationId);
    if (!workOrder) {
      throw new NotFoundError('Work order not found');
    }

    const currentStatus = workOrder.status as unknown as WorkOrderStatus;

    // Enforce finite state machine transition rule
    validateStatusTransition(currentStatus, nextStatus);

    return this.repo.updateStatusInTx(
      workOrderId,
      currentStatus,
      nextStatus,
      reason,
      actorId,
    );
  }
}

export const workOrdersService = new WorkOrdersService();
