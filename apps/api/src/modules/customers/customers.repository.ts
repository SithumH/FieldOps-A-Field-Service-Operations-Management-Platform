import { prisma } from '../../common/database/prisma';
import { CreateCustomerInput } from '@fieldops/contracts';

export class CustomersRepository {
  async findByOrganization(organizationId: string, search?: string) {
    return prisma.customer.findMany({
      where: {
        organizationId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, organizationId: string) {
    return prisma.customer.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        addresses: true,
        serviceRequests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        workOrders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async create(organizationId: string, input: CreateCustomerInput) {
    return prisma.customer.create({
      data: {
        organizationId,
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        companyName: input.companyName,
        addresses: input.address
          ? {
              create: {
                label: input.address.label,
                street: input.address.street,
                city: input.address.city,
                state: input.address.state,
                postalCode: input.address.postalCode,
                country: input.address.country,
              },
            }
          : undefined,
      },
      include: {
        addresses: true,
      },
    });
  }

  async findByEmail(email: string, organizationId: string) {
    return prisma.customer.findFirst({
      where: {
        email: email.toLowerCase(),
        organizationId,
      },
    });
  }
}

export const customersRepository = new CustomersRepository();

