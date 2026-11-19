
import { rateLimit } from 'express-rate-limit';

const createLimiter = (
  windowMs: number,
  limit: number,
  message: string,
) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

// Register: 5 requests / 1 hour
export const registerLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  'Too many registration attempts. Try again later.',
);

// Login: 10 requests / 15 minutes
export const loginLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many login attempts. Try again later.',
);

// Resend verification: 3 requests / 15 minutes
export const resendVerificationLimiter = createLimiter(
  15 * 60 * 1000,
  3,
  'Too many verification requests. Try again later.',
);

// Forgot password: 3 requests / 15 minutes
export const forgotPasswordLimiter = createLimiter(
  15 * 60 * 1000,
  3,
  'Too many password reset requests. Try again later.',
);

// Reset password: 5 requests / 15 minutes
export const resetPasswordLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many reset attempts. Try again later.',
);

// Verify email: 10 requests / 15 minutes
export const verifyEmailLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many verification attempts. Try again later.',
);


/**
 * TWO-FACTOR AUTHENTICATION RATE LIMITERS
 */

// Limite les demandes d'activation et de challenge 2FA.
export const twoFactorLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many two-factor authentication requests. Please try again later.",

);

// Limite les tentatives de vérification OTP.
export const verifyTwoFactorLimiter = createLimiter(
  15 * 60 * 1000,
  5,
 "Too many OTP verification attempts. Please try again later.",
);

// Limite les demandes de renvoi OTP.
export const resendTwoFactorLimiter = createLimiter(
  15 * 60 * 1000,
  3,
  "Too many OTP resend requests. Please try again later.",
);

