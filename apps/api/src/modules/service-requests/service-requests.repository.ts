import { prisma } from '../../common/database/prisma';
import { CreateServiceRequestInput, ServiceRequestStatus } from '@fieldops/contracts';

export class ServiceRequestsRepository {
  async findByOrganization(organizationId: string, status?: ServiceRequestStatus) {
    return prisma.serviceRequest.findMany({
      where: {
        customer: {
          organizationId,
        },
        ...(status ? { status } : {}),
      },
      include: {
        customer: true,
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, organizationId: string) {
    return prisma.serviceRequest.findFirst({
      where: {
        id,
        customer: {
          organizationId,
        },
      },
      include: {
        customer: {
          include: {
            addresses: true,
          },
        },
        service: true,
        workOrders: true,
      },
    });
  }

  async create(input: CreateServiceRequestInput) {
    return prisma.serviceRequest.create({
      data: {
        customerId: input.customerId,
        serviceId: input.serviceId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        preferredDate: input.preferredDate ? new Date(input.preferredDate) : undefined,
      },
      include: {
        customer: true,
        service: true,
      },
    });
  }

  async updateStatus(id: string, status: ServiceRequestStatus) {
    return prisma.serviceRequest.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        service: true,
      },
    });
  }
}

export const serviceRequestsRepository = new ServiceRequestsRepository();

