import { serviceCatalogRepository, ServiceCatalogRepository } from './service-catalog.repository';
import { CreateServiceCatalogItemInput } from '@fieldops/contracts';
import { ConflictError, NotFoundError } from '../../common/errors/app-error';

export class ServiceCatalogService {
  constructor(private repo: ServiceCatalogRepository = serviceCatalogRepository) {}

  async listCatalog(organizationId: string) {
    return this.repo.findByOrganization(organizationId);
  }

  async getCatalogItem(id: string, organizationId: string) {
    const item = await this.repo.findById(id, organizationId);
    if (!item) {
      throw new NotFoundError('Service catalog item not found');
    }
    return item;
  }

  async createCatalogItem(organizationId: string, input: CreateServiceCatalogItemInput) {
    const existing = await this.repo.findByName(input.name, organizationId);
    if (existing) {
      throw new ConflictError('A service with this name already exists in your organization');
    }
    return this.repo.create(organizationId, input);
  }
}

export const serviceCatalogService = new ServiceCatalogService();

