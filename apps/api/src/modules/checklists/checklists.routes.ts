import { Router, Request, Response } from 'express';
import { prisma } from '../../common/database/prisma';
import { requireAuth, requireRole, enforceTenant } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { createChecklistSchema, UserRole } from '@fieldops/contracts';
import { sendCreated, sendSuccess } from '../../common/http/response';
import { NotFoundError } from '../../common/errors/app-error';

export const checklistsRouter = Router();

checklistsRouter.use(requireAuth, enforceTenant);

checklistsRouter.post(
  '/work-orders/:id/checklists',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.TECHNICIAN),
  validateBody(createChecklistSchema),
  async (req: Request, res: Response) => {
    const workOrderId = req.params.id as string;
    const { title, items } = req.body;

    // Check work order belongs to tenant
    const workOrder = await prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
        customer: { organizationId: req.user!.organizationId! },
      },
    });

    if (!workOrder) {
      throw new NotFoundError('Work order not found in your organization');
    }

    const checklist = await prisma.workOrderChecklist.create({
      data: {
        workOrderId,
        title,
        items: {
          create: items.map((desc: string) => ({ description: desc })),
        },
      },
      include: {
        items: true,
      },
    });

    return sendCreated(res, checklist);
  },
);

checklistsRouter.patch(
  '/checklists/items/:itemId/toggle',
  requireRole(UserRole.ORG_ADMIN, UserRole.DISPATCHER, UserRole.TECHNICIAN),
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId as string;

    const item = await prisma.checklistItem.findFirst({
      where: {
        id: itemId,
        checklist: {
          workOrder: {
            customer: { organizationId: req.user!.organizationId! },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Checklist item not found');
    }

    const isCompleted = !item.isCompleted;
    const updated = await prisma.checklistItem.update({
      where: { id: itemId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return sendSuccess(res, updated);
  },
);

