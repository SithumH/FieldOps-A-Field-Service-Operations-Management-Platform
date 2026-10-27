import { Request, Response, NextFunction } from 'express';
import { AuthSessionUser, UserRole } from '@fieldops/contracts';
import { verifySessionToken } from '../common/security/session';
import { UnauthorizedError, ForbiddenError } from '../common/errors/app-error';

declare global {
  namespace Express {
    interface Request {
      user?: AuthSessionUser;
    }
  }
}

export const SESSION_COOKIE_NAME = 'fieldops_session';

export function authenticateSession(req: Request, _res: Response, next: NextFunction) {
  // Check cookie first, fallback to Authorization header
  const token =
    req.cookies?.[SESSION_COOKIE_NAME] ||
    req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (token) {
    const session = verifySessionToken(token);
    if (session) {
      req.user = {
        id: session.id,
        organizationId: session.organizationId,
        email: session.email,
        role: session.role,
        firstName: session.firstName,
        lastName: session.lastName,
      };
    }
  }

  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedError('Authentication is required to access this resource');
  }
  next();
}

export function requireRole(...allowedRoles: (UserRole | string)[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next(); // Platform super admin has cross-cutting access
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Role ${req.user.role} does not have required permissions.`,
      );
    }

    next();
  };
}

export function enforceTenant(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (req.user.role === UserRole.SUPER_ADMIN) {
    return next();
  }

  if (!req.user.organizationId) {
    throw new ForbiddenError('User is not associated with any organization');
  }

  next();
}

