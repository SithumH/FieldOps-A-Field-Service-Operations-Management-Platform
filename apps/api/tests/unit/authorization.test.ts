import { describe, it, expect, vi } from 'vitest';
import { requireAuth, requireRole, enforceTenant } from '../../src/middleware/auth.middleware';
import { UnauthorizedError, ForbiddenError } from '../../src/common/errors/app-error';
import { UserRole } from '@fieldops/contracts';
import { Request, Response } from 'express';

describe('Authorization & Multi-Tenant Enforcement Middleware', () => {
  const mockRes = {} as Response;

  describe('requireAuth', () => {
    it('throws UnauthorizedError if user is missing', () => {
      const mockReq = {} as Request;
      const next = vi.fn();

      expect(() => requireAuth(mockReq, mockRes, next)).toThrow(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next() if user is present on request', () => {
      const mockReq = {
        user: { id: 'u1', email: 'test@example.com', role: UserRole.CUSTOMER, organizationId: 'o1' },
      } as Request;
      const next = vi.fn();

      requireAuth(mockReq, mockRes, next);
      expect(next).toHaveBeenCalledOnce();
    });
  });

  describe('requireRole', () => {
    it('allows access if user has one of allowed roles', () => {
      const mockReq = {
        user: { id: 'u1', email: 'disp@example.com', role: UserRole.DISPATCHER, organizationId: 'o1' },
      } as Request;
      const next = vi.fn();

      const middleware = requireRole(UserRole.DISPATCHER, UserRole.ORG_ADMIN);
      middleware(mockReq, mockRes, next);
      expect(next).toHaveBeenCalledOnce();
    });

    it('rejects access with ForbiddenError if user role is not allowed', () => {
      const mockReq = {
        user: { id: 'u1', email: 'tech@example.com', role: UserRole.TECHNICIAN, organizationId: 'o1' },
      } as Request;
      const next = vi.fn();

      const middleware = requireRole(UserRole.ORG_ADMIN, UserRole.FINANCE);
      expect(() => middleware(mockReq, mockRes, next)).toThrow(ForbiddenError);
      expect(next).not.toHaveBeenCalled();
    });

    it('always permits SUPER_ADMIN', () => {
      const mockReq = {
        user: { id: 'u0', email: 'super@fieldops.com', role: UserRole.SUPER_ADMIN, organizationId: null },
      } as Request;
      const next = vi.fn();

      const middleware = requireRole(UserRole.FINANCE);
      middleware(mockReq, mockRes, next);
      expect(next).toHaveBeenCalledOnce();
    });
  });

  describe('enforceTenant', () => {
    it('throws ForbiddenError if non-super-admin user lacks organizationId', () => {
      const mockReq = {
        user: { id: 'u1', email: 'orphan@example.com', role: UserRole.ORG_ADMIN, organizationId: null },
      } as Request;
      const next = vi.fn();

      expect(() => enforceTenant(mockReq, mockRes, next)).toThrow(ForbiddenError);
    });

    it('passes if organizationId is present', () => {
      const mockReq = {
        user: { id: 'u1', email: 'user@org.com', role: UserRole.ORG_ADMIN, organizationId: 'org-123' },
      } as Request;
      const next = vi.fn();

      enforceTenant(mockReq, mockRes, next);
      expect(next).toHaveBeenCalledOnce();
    });
  });
});

