
import { apiClient } from "./clients";

import type {
  LoginUserDto,
  RegisterUserDto,
  ForgotPasswordDto,
  VerifyTwoFactorDto,
} from "@electronic-wallet/shared";

import type { ResetPasswordInput } from "@electronic-wallet/validation";

// User returned by the backend
export interface AuthUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  } | null;
}

// Authentication session after successful OTP verification
export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

// Login response before OTP verification
export interface LoginChallenge {
  requiresTwoFactor: true;
  challengeId: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
  maskedDestination: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RecoveryResponse {
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export const authApi = {
  // Login: email + password -> OTP challenge
  login: async (input: LoginUserDto): Promise<LoginChallenge> => {
    const { data } = await apiClient.post<ApiResponse<LoginChallenge>>(
      "/auth/login",
      input
    );

    return data.data;
  },

  // Verify OTP -> complete authentication
  verifyTwoFactor: async (
    input: VerifyTwoFactorDto
  ): Promise<AuthSession> => {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>(
      "/auth/verify-2fa",
      input
    );

    return data.data;
  },

  // Refresh access token using HttpOnly cookie
  refresh: async (): Promise<RefreshResponse> => {
    const { data } = await apiClient.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh"
    );

    return data.data;
  },

  // Register
  register: async (
    input: RegisterUserDto
  ): Promise<{
    userId: string;
    requiresVerification: boolean;
  }> => {
    const { data } = await apiClient.post<{
      userId: string;
      requiresVerification: boolean;
    }>("/auth/register", input);

    return data;
  },

  // Request password reset
  requestPasswordReset: async (
    input: ForgotPasswordDto
  ): Promise<RecoveryResponse> => {
    const { data } = await apiClient.post<RecoveryResponse>(
      "/auth/forgot-password",
      input
    );

    return data;
  },

  // Reset password
  resetPassword: async (
    input: ResetPasswordInput
  ): Promise<void> => {
    await apiClient.post("/auth/reset-password", input);
  },

  // Verify account email
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post("/auth/verify-email", { token });
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  // Get authenticated user
  me: async (): Promise<{ user: AuthUser }> => {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>(
      "/auth/me"
    );

    return {
      user: data.data,
    };
  },
};
