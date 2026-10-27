import { WorkOrderStatus } from '@fieldops/contracts';
import { BadRequestError } from '../../common/errors/app-error';

const VALID_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  [WorkOrderStatus.REQUESTED]: [
    WorkOrderStatus.CONFIRMED,
    WorkOrderStatus.CANCELLED,
  ],
  [WorkOrderStatus.CONFIRMED]: [
    WorkOrderStatus.SCHEDULED,
    WorkOrderStatus.CANCELLED,
  ],
  [WorkOrderStatus.SCHEDULED]: [
    WorkOrderStatus.ASSIGNED,
    WorkOrderStatus.CONFIRMED,
    WorkOrderStatus.CANCELLED,
  ],
  [WorkOrderStatus.ASSIGNED]: [
    WorkOrderStatus.IN_PROGRESS,
    WorkOrderStatus.SCHEDULED, // Unassigning technician
    WorkOrderStatus.CANCELLED,
  ],
  [WorkOrderStatus.IN_PROGRESS]: [
    WorkOrderStatus.ON_HOLD,
    WorkOrderStatus.COMPLETED,
  ],
  [WorkOrderStatus.ON_HOLD]: [
    WorkOrderStatus.IN_PROGRESS,
    WorkOrderStatus.CANCELLED,
  ],
  [WorkOrderStatus.COMPLETED]: [
    WorkOrderStatus.INVOICED,
  ],
  [WorkOrderStatus.INVOICED]: [
    WorkOrderStatus.CLOSED,
  ],
  [WorkOrderStatus.CLOSED]: [],
  [WorkOrderStatus.CANCELLED]: [],
};

export function validateStatusTransition(currentStatus: WorkOrderStatus, nextStatus: WorkOrderStatus): void {
  if (currentStatus === nextStatus) {
    return;
  }

  const allowedNext = VALID_TRANSITIONS[currentStatus];
  if (!allowedNext || !allowedNext.includes(nextStatus)) {
    throw new BadRequestError(
      `Invalid work order status transition from ${currentStatus} to ${nextStatus}. Allowed transitions: [${allowedNext?.join(', ') || 'none'}]`,
    );
  }
}

