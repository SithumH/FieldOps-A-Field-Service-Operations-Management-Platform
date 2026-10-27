import { describe, it, expect, vi } from 'vitest';
import { InventoryService } from '../../src/modules/inventory/inventory.service';
import { InvoicesService } from '../../src/modules/invoices/invoices.service';
import { BadRequestError, NotFoundError } from '../../src/common/errors/app-error';
import { WorkOrderStatus } from '@fieldops/contracts';
import { Prisma } from '@prisma/client';

describe('Inventory & Invoicing Business Rules', () => {
  describe('InventoryService', () => {
    it('delegates parts usage recording to repository with tenant guard', async () => {
      const mockRepo = {
        recordPartsUsageInTx: vi.fn().mockResolvedValue({
          partsUsage: { id: 'pu-1', quantity: 2 },
          updatedStock: 8,
        }),
      } as any;

      const service = new InventoryService(mockRepo);
      const result = await service.recordPartsUsage('wo-1', 'org-1', {
        inventoryItemId: 'inv-item-1',
        quantity: 2,
      });

      expect(result).toBeDefined();
      expect(result.updatedStock).toBe(8);
      expect(mockRepo.recordPartsUsageInTx).toHaveBeenCalledWith('wo-1', 'inv-item-1', 2, 'org-1');
    });
  });

  describe('InvoicesService', () => {
    it('strictly forbids generating an invoice if work order status is NOT COMPLETED', async () => {
      const mockWorkOrderRepo = {
        findById: vi.fn().mockResolvedValue({
          id: 'wo-1',
          status: WorkOrderStatus.IN_PROGRESS, // Not completed yet!
          invoices: [],
        }),
      } as any;

      const service = new InvoicesService({} as any, mockWorkOrderRepo);

      await expect(
        service.generateInvoice('wo-1', 'org-1', { taxRate: 10 }),
      ).rejects.toThrow(BadRequestError);
    });

    it('forbids generating duplicate invoices for an already invoiced work order', async () => {
      const mockWorkOrderRepo = {
        findById: vi.fn().mockResolvedValue({
          id: 'wo-1',
          status: WorkOrderStatus.COMPLETED,
          invoices: [{ id: 'inv-existing-1' }], // Already has an invoice!
        }),
      } as any;

      const service = new InvoicesService({} as any, mockWorkOrderRepo);

      await expect(
        service.generateInvoice('wo-1', 'org-1', { taxRate: 0 }),
      ).rejects.toThrow(BadRequestError);
    });

    it('accurately calculates itemized totals combining labor fee, parts used, and tax', async () => {
      const mockWorkOrderRepo = {
        findById: vi.fn().mockResolvedValue({
          id: 'wo-1',
          status: WorkOrderStatus.COMPLETED,
          invoices: [],
          service: {
            name: 'AC Precision Service',
            basePrice: new Prisma.Decimal(100.0),
          },
          partsUsage: [
            {
              quantity: 2,
              unitPrice: new Prisma.Decimal(50.0),
              inventoryItem: { name: 'AC Filter', sku: 'FLT-01' },
            },
          ],
        }),
      } as any;

      const mockInvoiceRepo = {
        createInvoiceInTx: vi.fn().mockImplementation((_woId, _invNum, subtotal, taxRate, tax, total) => {
          return {
            subtotal: subtotal.toNumber(),
            taxRate: taxRate.toNumber(),
            tax: tax.toNumber(),
            total: total.toNumber(),
          };
        }),
      } as any;

      const service = new InvoicesService(mockInvoiceRepo, mockWorkOrderRepo);

      // Subtotal should be: 100.00 (service) + 2 * 50.00 (parts) = 200.00
      // Tax at 10%: 20.00
      // Total: 220.00
      const invoice = await service.generateInvoice(
        'wo-1',
        'org-1',
        { taxRate: 10 },
        'actor-admin-1',
      );

      expect(invoice).toBeDefined();
      expect(invoice.subtotal).toBe(200);
      expect(invoice.tax).toBe(20);
      expect(invoice.total).toBe(220);
    });
  });
});

