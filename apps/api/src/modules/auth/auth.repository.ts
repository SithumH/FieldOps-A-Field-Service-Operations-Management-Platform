import { prisma } from '../../common/database/prisma';
import { RegisterOrganizationInput } from '@fieldops/contracts';
import { Role } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        organization: true,
      },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });
  }

  async createOrganizationWithAdmin(
    input: RegisterOrganizationInput,
    passwordHash: string,
    slug: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: input.organizationName,
          slug,
          phone: input.phone,
          email: input.email.toLowerCase(),
        },
      });

      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          email: input.email.toLowerCase(),
          passwordHash,
          role: Role.ORG_ADMIN,
          firstName: input.adminFirstName,
          lastName: input.adminLastName,
          phone: input.phone,
        },
      });

      return { organization, user };
    });
  }
}

export const authRepository = new AuthRepository();

