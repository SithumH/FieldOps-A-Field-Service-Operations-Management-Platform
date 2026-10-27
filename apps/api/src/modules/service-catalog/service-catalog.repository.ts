import { prisma } from '../../common/database/prisma';
import { CreateServiceCatalogItemInput } from '@fieldops/contracts';
import { Prisma } from '@prisma/client';

export class ServiceCatalogRepository {
  async findByOrganization(organizationId: string) {
    return prisma.serviceCatalog.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, organizationId: string) {
    return prisma.serviceCatalog.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async findByName(name: string, organizationId: string) {
    return prisma.serviceCatalog.findFirst({
      where: {
        name,
        organizationId,
      },
    });
  }

  async create(organizationId: string, input: CreateServiceCatalogItemInput) {
    return prisma.serviceCatalog.create({
      data: {
        organizationId,
        name: input.name,
        description: input.description,
        defaultDuration: input.defaultDuration,
        basePrice: new Prisma.Decimal(input.basePrice),
      },
    });
  }
}

export const serviceCatalogRepository = new ServiceCatalogRepository();

