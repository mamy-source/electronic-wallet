
import { randomBytes, createHash } from 'node:crypto';

export interface GeneratedToken {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

export const hashToken = (token: string): string => {
  return createHash('sha256')
    .update(token)
    .digest('hex');
};

export const generateSecureToken = (
  expiresInMinutes: number,
): GeneratedToken => {
  if (
    !Number.isSafeInteger(expiresInMinutes) ||
    expiresInMinutes <= 0
  ) {
    throw new Error('Invalid token expiration');
  }

  const token = randomBytes(32).toString('hex');

  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + expiresInMinutes * 60 * 1000,
  );

  return {
    token,
    tokenHash,
    expiresAt,
  };
};