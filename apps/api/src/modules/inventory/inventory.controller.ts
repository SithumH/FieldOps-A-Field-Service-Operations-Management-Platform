import { Request, Response } from 'express';
import { inventoryService, InventoryService } from './inventory.service';
import { sendSuccess, sendCreated } from '../../common/http/response';

export class InventoryController {
  constructor(private service: InventoryService = inventoryService) {}

  list = async (req: Request, res: Response) => {
    const items = await this.service.listInventory(req.user!.organizationId!);
    return sendSuccess(res, items);
  };

  create = async (req: Request, res: Response) => {
    const item = await this.service.createInventoryItem(req.user!.organizationId!, req.body);
    return sendCreated(res, item);
  };

  recordPartsUsage = async (req: Request, res: Response) => {
    const result = await this.service.recordPartsUsage(
      req.params.id as string,
      req.user!.organizationId!,
      req.body,
    );
    return sendCreated(res, result);
  };
}

export const inventoryController = new InventoryController();

