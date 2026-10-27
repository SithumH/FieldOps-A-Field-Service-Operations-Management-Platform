import { inventoryRepository, InventoryRepository } from './inventory.repository';
import { CreateInventoryItemInput, RecordPartsUsageInput } from '@fieldops/contracts';
import { ConflictError } from '../../common/errors/app-error';
import { prisma } from '../../common/database/prisma';

export class InventoryService {
  constructor(private repo: InventoryRepository = inventoryRepository) {}

  async listInventory(organizationId: string) {
    const items = await this.repo.findByOrganization(organizationId);
    return items.map((item) => ({
      ...item,
      isLowStock: item.quantityOnHand <= item.reorderLevel,
    }));
  }

  async createInventoryItem(organizationId: string, input: CreateInventoryItemInput) {
    const existing = await prisma.inventoryItem.findFirst({
      where: {
        sku: input.sku.toUpperCase(),
        organizationId,
      },
    });

    if (existing) {
      throw new ConflictError(`An inventory item with SKU ${input.sku.toUpperCase()} already exists`);
    }

    return this.repo.create(organizationId, input);
  }

  async recordPartsUsage(
    workOrderId: string,
    organizationId: string,
    input: RecordPartsUsageInput,
  ) {
    return this.repo.recordPartsUsageInTx(
      workOrderId,
      input.inventoryItemId,
      input.quantity,
      organizationId,
    );
  }
}

export const inventoryService = new InventoryService();

