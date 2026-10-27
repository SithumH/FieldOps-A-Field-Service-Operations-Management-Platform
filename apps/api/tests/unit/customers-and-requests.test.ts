import { describe, it, expect, vi } from 'vitest';
import { CustomersService } from '../../src/modules/customers/customers.service';
import { ServiceRequestsService } from '../../src/modules/service-requests/service-requests.service';
import { NotFoundError, ConflictError, BadRequestError } from '../../src/common/errors/app-error';
import { ServiceRequestStatus, PriorityLevel } from '@fieldops/contracts';

describe('Customers & Service Requests Domain Logic', () => {
  describe('CustomersService', () => {
    it('throws ConflictError if customer email already exists in organization', async () => {
      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue({ id: 'c1', email: 'existing@client.com' }),
        create: vi.fn(),
      } as any;

      const service = new CustomersService(mockRepo);

      await expect(
        service.createCustomer('org-1', {
          name: 'Acme Corp',
          email: 'existing@client.com',
          phone: '+94771234567',
        }),
      ).rejects.toThrow(ConflictError);

      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundError if customer does not exist or belongs to another organization', async () => {
      const mockRepo = {
        findById: vi.fn().mockResolvedValue(null),
      } as any;

      const service = new CustomersService(mockRepo);

      await expect(service.getCustomerById('non-existent-id', 'org-1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('ServiceRequestsService', () => {
    it('prevents creating a request for a customer in a different organization', async () => {
      const mockCustomerRepo = {
        findById: vi.fn().mockResolvedValue(null), // Customer not found in caller's org
      } as any;
      const mockRequestRepo = {
        create: vi.fn(),
      } as any;
      const mockCatalogRepo = {} as any;

      const service = new ServiceRequestsService(mockRequestRepo, mockCustomerRepo, mockCatalogRepo);

      await expect(
        service.createRequest('org-1', {
          customerId: 'a0000000-0000-0000-0000-000000000001',
          title: 'HVAC repair',
          description: 'AC unit leaking water on floor',
          priority: PriorityLevel.HIGH,
        }),
      ).rejects.toThrow(NotFoundError);

      expect(mockRequestRepo.create).not.toHaveBeenCalled();
    });

    it('prevents changing status of an already CONVERTED request', async () => {
      const mockRequestRepo = {
        findById: vi.fn().mockResolvedValue({
          id: 'req-1',
          status: ServiceRequestStatus.CONVERTED,
        }),
        updateStatus: vi.fn(),
      } as any;

      const service = new ServiceRequestsService(mockRequestRepo, {} as any, {} as any);

      await expect(
        service.updateRequestStatus('req-1', 'org-1', {
          status: ServiceRequestStatus.REJECTED,
        }),
      ).rejects.toThrow(BadRequestError);

      expect(mockRequestRepo.updateStatus).not.toHaveBeenCalled();
    });
  });
});

