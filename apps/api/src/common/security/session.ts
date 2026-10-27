import crypto from 'crypto';
import { env } from '../../config/env';
import { AuthSessionUser } from '@fieldops/contracts';

export interface SessionPayload extends AuthSessionUser {
  exp: number; // Unix timestamp in seconds
  iat: number;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function createSessionToken(user: AuthSessionUser): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_TTL_SECONDS;

  const payload: SessionPayload = {
    ...user,
    iat,
    exp,
  };

  const serialized = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', env.SESSION_SECRET)
    .update(serialized)
    .digest('base64url');

  return `${serialized}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [serialized, signature] = parts;
    if (!serialized || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', env.SESSION_SECRET)
      .update(serialized)
      .digest('base64url');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const actualBuffer = Buffer.from(signature, 'utf-8');

    if (
      expectedBuffer.length !== actualBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, actualBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(serialized, 'base64url').toString('utf-8')) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

