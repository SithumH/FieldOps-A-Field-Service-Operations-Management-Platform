import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/common/security/password';
import { createSessionToken, verifySessionToken } from '../../src/common/security/session';
import { UserRole } from '@fieldops/contracts';

describe('Security & Cryptography Utilities', () => {
  describe('Argon2id Password Hashing', () => {
    it('generates a secure Argon2id hash', async () => {
      const password = 'SuperSecurePassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$argon2id\$/);
    });

    it('verifies a correct password successfully', async () => {
      const password = 'CorrectPassword456!';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(hash, password);
      expect(isValid).toBe(true);
    });

    it('rejects an incorrect password', async () => {
      const password = 'OriginalPassword789!';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(hash, 'WrongPassword!');
      expect(isValid).toBe(false);
    });
  });

  describe('Session Token Signatures & Tamper Prevention', () => {
    const testUser = {
      id: 'usr-123',
      organizationId: 'org-456',
      email: 'dispatcher@fieldops.com',
      role: UserRole.DISPATCHER,
      firstName: 'Samantha',
      lastName: 'Smith',
    };

    it('creates a signed session token and successfully verifies it', () => {
      const token = createSessionToken(testUser);
      expect(token).toBeDefined();
      expect(token).toContain('.');

      const verified = verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.id).toBe(testUser.id);
      expect(verified?.organizationId).toBe(testUser.organizationId);
      expect(verified?.role).toBe(UserRole.DISPATCHER);
    });

    it('rejects tampered signatures', () => {
      const token = createSessionToken(testUser);
      const [payload] = token.split('.');
      const fakeSignature = 'tampered_signature_bytes';
      const tamperedToken = `${payload}.${fakeSignature}`;

      const verified = verifySessionToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it('rejects tampered payloads', () => {
      const token = createSessionToken(testUser);
      const [, signature] = token.split('.');

      // Try tampering the role to SUPER_ADMIN
      const maliciousPayload = Buffer.from(
        JSON.stringify({ ...testUser, role: UserRole.SUPER_ADMIN, exp: Math.floor(Date.now() / 1000) + 3600 }),
      ).toString('base64url');

      const tamperedToken = `${maliciousPayload}.${signature}`;
      const verified = verifySessionToken(tamperedToken);
      expect(verified).toBeNull();
    });
  });
});

