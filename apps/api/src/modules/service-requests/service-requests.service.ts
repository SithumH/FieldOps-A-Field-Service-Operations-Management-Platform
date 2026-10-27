import { serviceRequestsRepository, ServiceRequestsRepository } from './service-requests.repository';
import { customersRepository, CustomersRepository } from '../customers/customers.repository';
import { serviceCatalogRepository, ServiceCatalogRepository } from '../service-catalog/service-catalog.repository';
import { CreateServiceRequestInput, ServiceRequestStatus, UpdateServiceRequestStatusInput } from '@fieldops/contracts';
import { NotFoundError, BadRequestError } from '../../common/errors/app-error';

export class ServiceRequestsService {
  constructor(
    private repo: ServiceRequestsRepository = serviceRequestsRepository,
    private customerRepo: CustomersRepository = customersRepository,
    private catalogRepo: ServiceCatalogRepository = serviceCatalogRepository,
  ) {}

  async listRequests(organizationId: string, status?: ServiceRequestStatus) {
    return this.repo.findByOrganization(organizationId, status);
  }

  async getRequestById(id: string, organizationId: string) {
    const request = await this.repo.findById(id, organizationId);
    if (!request) {
      throw new NotFoundError('Service request not found in your organization');
    }
    return request;
  }

  async createRequest(organizationId: string, input: CreateServiceRequestInput) {
    // Enforce that customer belongs to the tenant
    const customer = await this.customerRepo.findById(input.customerId, organizationId);
    if (!customer) {
      throw new NotFoundError('Customer not found in this organization');
    }

    // If serviceId provided, enforce catalog belongs to tenant
    if (input.serviceId) {
      const service = await this.catalogRepo.findById(input.serviceId, organizationId);
      if (!service) {
        throw new NotFoundError('Service catalog item not found in this organization');
      }
    }

    return this.repo.create(input);
  }

  async updateRequestStatus(
    id: string,
    organizationId: string,
    input: UpdateServiceRequestStatusInput,
  ) {
    const request = await this.repo.findById(id, organizationId);
    if (!request) {
      throw new NotFoundError('Service request not found');
    }

    if (request.status === ServiceRequestStatus.CONVERTED) {
      throw new BadRequestError('Converted requests cannot change status');
    }

    return this.repo.updateStatus(id, input.status);
  }
}

export const serviceRequestsService = new ServiceRequestsService();

