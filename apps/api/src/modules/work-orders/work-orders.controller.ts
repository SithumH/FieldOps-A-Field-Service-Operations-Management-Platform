import { Request, Response } from 'express';
import { workOrdersService, WorkOrdersService } from './work-orders.service';
import { sendSuccess, sendCreated } from '../../common/http/response';
import { WorkOrderStatus, PriorityLevel } from '@fieldops/contracts';

export class WorkOrdersController {
  constructor(private service: WorkOrdersService = workOrdersService) {}

  list = async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as WorkOrderStatus | undefined,
      priority: req.query.priority as PriorityLevel | undefined,
      technicianId: req.query.technicianId as string | undefined,
    };

    const workOrders = await this.service.listWorkOrders(req.user!.organizationId!, filters);
    return sendSuccess(res, workOrders);
  };

  getById = async (req: Request, res: Response) => {
    const workOrder = await this.service.getWorkOrderById(
      req.params.id as string,
      req.user!.organizationId!,
    );
    return sendSuccess(res, workOrder);
  };

  create = async (req: Request, res: Response) => {
    const workOrder = await this.service.createWorkOrder(req.user!.organizationId!, req.body);
    return sendCreated(res, workOrder);
  };

  assignTechnician = async (req: Request, res: Response) => {
    const result = await this.service.assignTechnician(
      req.params.id as string,
      req.user!.organizationId!,
      req.body,
      req.user!.id,
    );
    return sendSuccess(res, result);
  };

  reschedule = async (req: Request, res: Response) => {
    const result = await this.service.rescheduleWorkOrder(
      req.params.id as string,
      req.user!.organizationId!,
      req.body,
      req.user!.id,
    );
    return sendSuccess(res, result);
  };

  updateStatus = async (req: Request, res: Response) => {
    const result = await this.service.updateStatus(
      req.params.id as string,
      req.user!.organizationId!,
      req.body.status,
      req.body.reason,
      req.user!.id,
    );
    return sendSuccess(res, result);
  };

  startJob = async (req: Request, res: Response) => {
    const result = await this.service.updateStatus(
      req.params.id as string,
      req.user!.organizationId!,
      WorkOrderStatus.IN_PROGRESS,
      'Technician arrived on site and started work order',
      req.user!.id,
    );
    return sendSuccess(res, result);
  };

  completeJob = async (req: Request, res: Response) => {
    const result = await this.service.updateStatus(
      req.params.id as string,
      req.user!.organizationId!,
      WorkOrderStatus.COMPLETED,
      'Work order marked as completed by technician',
      req.user!.id,
    );
    return sendSuccess(res, result);
  };
}

export const workOrdersController = new WorkOrdersController();

