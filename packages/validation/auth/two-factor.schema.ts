
import { z } from 'zod';

/**
 * Common OTP validation
 * 6 digits, including leading zeros.
 */
export const otpCodeSchema = z
  .string()
  .regex(/^\d{6}$/, {
    message: 'Le code OTP doit contenir exactement 6 chiffres.',
  });

/**
 * Challenge ID
 */
export const challengeIdSchema = z
  .string()
  .trim()
  .min(1, 'Challenge ID is required.')
  .max(128, 'Invalid challenge ID.');

/**
 * Enable 2FA
 * Email is the only supported method for now.
 */
export const enableTwoFactorSchema = z
  .object({
    method: z.literal('EMAIL'),
  })
  .strict();

/**
 * Verify OTP
 * Used for setup, login and disable flows.
 */
export const verifyTwoFactorSchema = z
  .object({
    challengeId: challengeIdSchema,
    code: otpCodeSchema,
  })
  .strict();

/**
 * Disable 2FA
 */
export const disableTwoFactorSchema = z
  .object({
    challengeId: challengeIdSchema,
    code: otpCodeSchema,
  })
  .strict();

/**
 * Resend OTP
 */
export const resendTwoFactorCodeSchema = z
  .object({
    challengeId: challengeIdSchema,
  })
  .strict();

/**
 * Inferred types
 */
export type EnableTwoFactorInput = z.infer<
  typeof enableTwoFactorSchema
>;

export type VerifyTwoFactorInput = z.infer<
  typeof verifyTwoFactorSchema
>;

export type DisableTwoFactorInput = z.infer<
  typeof disableTwoFactorSchema
>;

export type ResendTwoFactorCodeInput = z.infer<
  typeof resendTwoFactorCodeSchema
>;
