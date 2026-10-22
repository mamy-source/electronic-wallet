import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),

  profile: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must contain at least 2 characters')
      .max(50, 'First name must not exceed 50 characters'),

    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must contain at least 2 characters')
      .max(50, 'Last name must not exceed 50 characters'),

    bio: z
      .string()
      .trim()
      .max(500, 'Bio must not exceed 500 characters')
      .optional(),
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),

});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});


export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .max(128, 'Password is too long'),
  }),
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;