
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
