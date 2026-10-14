import { createHash, randomBytes } from "node:crypto";

const REFRESH_TOKEN_LENGTH = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface GeneratedRefreshToken {
    token: string;
    tokenHash: string;
    expiresAt: Date;
}

// generate a refresh token  cryptographically secure random string and hash it using SHA-256
export const generateRefreshToken = (): GeneratedRefreshToken => {
    const token = randomBytes(32).toString('base64url');

    return {
        token,
        tokenHash: hashRefreshToken(token),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_LENGTH),
        
    };
}

export const hashRefreshToken = (token: string): string => {
    return createHash('sha256').update(token, 'utf8').digest('hex');
};