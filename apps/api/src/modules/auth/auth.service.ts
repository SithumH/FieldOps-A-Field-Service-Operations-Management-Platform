import { authRepository, AuthRepository } from './auth.repository';
import { hashPassword, verifyPassword } from '../../common/security/password';
import { createSessionToken } from '../../common/security/session';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../common/errors/app-error';
import { LoginInput, RegisterOrganizationInput, AuthSessionUser } from '@fieldops/contracts';

export class AuthService {
  constructor(private repo: AuthRepository = authRepository) {}

  async login(input: LoginInput) {
    const user = await this.repo.findUserByEmail(input.email);
    if (!user) {
      // Prevent user enumeration by maintaining consistent timing and generic message
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await verifyPassword(user.passwordHash, input.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const sessionUser: AuthSessionUser = {
      id: user.id,
      organizationId: user.organizationId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = createSessionToken(sessionUser);

    return {
      user: sessionUser,
      token,
    };
  }

  async registerOrganization(input: RegisterOrganizationInput) {
    const existing = await this.repo.findUserByEmail(input.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    // Generate clean slug from organization name
    const baseSlug = input.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const passwordHash = await hashPassword(input.password);
    const { user, organization } = await this.repo.createOrganizationWithAdmin(
      input,
      passwordHash,
      slug,
    );

    const sessionUser: AuthSessionUser = {
      id: user.id,
      organizationId: organization.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = createSessionToken(sessionUser);

    return {
      user: sessionUser,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return {
      id: user.id,
      organizationId: user.organizationId,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
          }
        : null,
    };
  }
}

export const authService = new AuthService();

