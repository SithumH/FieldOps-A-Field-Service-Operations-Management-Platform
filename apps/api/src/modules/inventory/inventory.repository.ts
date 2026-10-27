import { prisma } from '../../common/database/prisma';
import { CreateInventoryItemInput } from '@fieldops/contracts';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../common/errors/app-error';

export class InventoryRepository {
  async findByOrganization(organizationId: string) {
    return prisma.inventoryItem.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, organizationId: string) {
    return prisma.inventoryItem.findFirst({
      where: { id, organizationId },
    });
  }

  async create(organizationId: string, input: CreateInventoryItemInput) {
    return prisma.inventoryItem.create({
      data: {
        organizationId,
        sku: input.sku.toUpperCase(),
        name: input.name,
        description: input.description,
        unitCost: new Prisma.Decimal(input.unitCost),
        unitPrice: new Prisma.Decimal(input.unitPrice),
        quantityOnHand: input.quantityOnHand,
        reorderLevel: input.reorderLevel,
      },
    });
  }

  async recordPartsUsageInTx(
    workOrderId: string,
    inventoryItemId: string,
    quantity: number,
    organizationId: string,
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch current inventory item with row-level check
      const item = await tx.inventoryItem.findFirst({
        where: { id: inventoryItemId, organizationId },
      });

      if (!item) {
        throw new NotFoundError('Inventory item not found in your organization');
      }

      // 2. Concurrency & stock availability guard
      if (item.quantityOnHand < quantity) {
        throw new BadRequestError(
          `Insufficient stock for item ${item.name} (${item.sku}). Requested: ${quantity}, Available: ${item.quantityOnHand}`,
        );
      }

      // 3. Atomically decrement stock
      const updatedItem = await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: {
          quantityOnHand: {
            decrement: quantity,
          },
        },
      });

      // 4. Create parts usage record referencing work order
      const partsUsage = await tx.partsUsage.create({
        data: {
          workOrderId,
          inventoryItemId,
          quantity,
          unitPrice: item.unitPrice,
        },
        include: {
          inventoryItem: true,
        },
      });

      return { partsUsage, updatedStock: updatedItem.quantityOnHand };
    });
  }
}

export const inventoryRepository = new InventoryRepository();

