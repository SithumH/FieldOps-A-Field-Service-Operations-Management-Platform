import { describe, it, expect, vi } from 'vitest';
import { validateStatusTransition } from '../../src/modules/work-orders/work-orders.state-machine';
import { WorkOrdersService } from '../../src/modules/work-orders/work-orders.service';
import { WorkOrderStatus } from '@fieldops/contracts';
import { BadRequestError, ConflictError } from '../../src/common/errors/app-error';
import { prisma } from '../../src/common/database/prisma';

describe('Scheduling Engine & Work Order State Machine', () => {
  describe('validateStatusTransition (Finite State Machine)', () => {
    it('allows valid progression: REQUESTED -> CONFIRMED -> SCHEDULED -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> INVOICED -> CLOSED', () => {
      expect(() => validateStatusTransition(WorkOrderStatus.REQUESTED, WorkOrderStatus.CONFIRMED)).not.toThrow();
      expect(() => validateStatusTransition(WorkOrderStatus.CONFIRMED, WorkOrderStatus.SCHEDULED)).not.toThrow();
      expect(() => validateStatusTransition(WorkOrderStatus.SCHEDULED, WorkOrderStatus.ASSIGNED)).not.toThrow();
      expect(() => validateStatusTransition(WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS)).not.toThrow();
      expect(() => validateStatusTransition(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.COMPLETED)).not.toThrow();
      expect(() => validateStatusTransition(WorkOrderStatus.COMPLETED, WorkOrderStatus.INVOICED)).not.toThrow();
      expect(() => validateStatusTransition(WorkOrderStatus.INVOICED, WorkOrderStatus.CLOSED)).not.toThrow();
    });

    it('allows valid hold and resume: IN_PROGRESS -> ON_HOLD -> IN_PROGRESS', () => {
      expect(() => validateStatusTransition(WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.ON_HOLD)).not.toThrow();
      expect(() => validateStatusTransition(WorkOrderStatus.ON_HOLD, WorkOrderStatus.IN_PROGRESS)).not.toThrow();
    });

    it('allows unassigning a technician: ASSIGNED -> SCHEDULED', () => {
      expect(() => validateStatusTransition(WorkOrderStatus.ASSIGNED, WorkOrderStatus.SCHEDULED)).not.toThrow();
    });

    it('rejects invalid jumps (e.g. REQUESTED directly to COMPLETED or INVOICED)', () => {
      expect(() => validateStatusTransition(WorkOrderStatus.REQUESTED, WorkOrderStatus.COMPLETED)).toThrow(BadRequestError);
      expect(() => validateStatusTransition(WorkOrderStatus.REQUESTED, WorkOrderStatus.INVOICED)).toThrow(BadRequestError);
    });

    it('rejects transitioning from CANCELLED to IN_PROGRESS', () => {
      expect(() => validateStatusTransition(WorkOrderStatus.CANCELLED, WorkOrderStatus.IN_PROGRESS)).toThrow(BadRequestError);
    });

    it('rejects transitioning from CLOSED to IN_PROGRESS', () => {
      expect(() => validateStatusTransition(WorkOrderStatus.CLOSED, WorkOrderStatus.IN_PROGRESS)).toThrow(BadRequestError);
    });
  });

  describe('Conflict Prevention Engine (Double-Booking Prevention)', () => {
    it('rejects assignment if technician already has a conflicting job during requested window', async () => {
      const mockRepo = {
        findById: vi.fn().mockResolvedValue({
          id: 'wo-1',
          status: WorkOrderStatus.SCHEDULED,
        }),
        findConflictingAssignments: vi.fn().mockResolvedValue([
          {
            workOrderId: 'wo-conflict-99',
            workOrder: {
              id: 'wo-conflict-99',
              workOrderNumber: 'WO-2026-9999',
              scheduledStart: new Date('2026-11-01T10:00:00Z'),
              scheduledEnd: new Date('2026-11-01T12:00:00Z'),
            },
          },
        ]),
        assignTechnicianInTx: vi.fn(),
      } as any;

      // Mock technician profile finding in prisma
      vi.spyOn(prisma.technicianProfile, 'findFirst').mockResolvedValue({
        id: 'tech-1',
        userId: 'u-tech-1',
        isAvailable: true,
        hourlyRate: {} as any,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { firstName: 'Kasun', lastName: 'Perera' } as any,
      });

      const service = new WorkOrdersService(mockRepo, {} as any);

      await expect(
        service.assignTechnician(
          'wo-1',
          'org-1',
          {
            technicianId: 'tech-1',
            scheduledStart: '2026-11-01T10:30:00Z',
            scheduledEnd: '2026-11-01T11:30:00Z',
          },
          'dispatcher-id',
        ),
      ).rejects.toThrow(ConflictError);

      expect(mockRepo.assignTechnicianInTx).not.toHaveBeenCalled();
    });

    it('rejects assignment if scheduledEnd is before scheduledStart', async () => {
      const mockRepo = {
        findById: vi.fn().mockResolvedValue({
          id: 'wo-1',
          status: WorkOrderStatus.SCHEDULED,
        }),
      } as any;

      const service = new WorkOrdersService(mockRepo, {} as any);

      await expect(
        service.assignTechnician(
          'wo-1',
          'org-1',
          {
            technicianId: 'tech-1',
            scheduledStart: '2026-11-01T12:00:00Z',
            scheduledEnd: '2026-11-01T10:00:00Z', // End is before start
          },
          'dispatcher-id',
        ),
      ).rejects.toThrow(BadRequestError);
    });

    it('allows assignment when there are NO conflicts', async () => {
      const mockRepo = {
        findById: vi.fn().mockResolvedValue({
          id: 'wo-1',
          status: WorkOrderStatus.SCHEDULED,
        }),
        findConflictingAssignments: vi.fn().mockResolvedValue([]), // No conflicts
        assignTechnicianInTx: vi.fn().mockResolvedValue({
          workOrder: { id: 'wo-1', status: WorkOrderStatus.ASSIGNED },
          assignment: { id: 'asgn-1', technicianId: 'tech-1' },
        }),
      } as any;

      vi.spyOn(prisma.technicianProfile, 'findFirst').mockResolvedValue({
        id: 'tech-1',
        userId: 'u-tech-1',
        isAvailable: true,
        hourlyRate: {} as any,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { firstName: 'Kasun', lastName: 'Perera' } as any,
      });

      const service = new WorkOrdersService(mockRepo, {} as any);

      const result = await service.assignTechnician(
        'wo-1',
        'org-1',
        {
          technicianId: 'tech-1',
          scheduledStart: '2026-11-01T14:00:00Z',
          scheduledEnd: '2026-11-01T16:00:00Z',
        },
        'dispatcher-id',
      );

      expect(result).toBeDefined();
      expect(mockRepo.assignTechnicianInTx).toHaveBeenCalledOnce();
    });
  });
});

