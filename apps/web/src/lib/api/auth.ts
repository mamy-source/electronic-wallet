import { apiClient } from "./clients";

import type {
  LoginUserDto,
  RegisterUserDto,
  ForgotPasswordDto,
} from "@electronic-wallet/shared";

import type { ResetPasswordInput } from "@electronic-wallet/validation";


export interface AuthUser {
  id: string;
  email: string;
  name: string;
  tier: string;
  requires2FA?: boolean;
  role: "USER" | "ADMIN";
  profile: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  } | null;
}

export interface AuthSession {
  accesToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RecoveryResponse {
  message: string;
}


export const authApi = {
  login: async (input: LoginUserDto): Promise<AuthSession> => {
    const { data } = await apiClient.post<{
      success: string;
      message: string;
      timestamp: string;
      data: AuthSession;
    }>(
      "/auth/login",
      input
    );

    return data.data;
  },

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

  requestPasswordReset: async (
    input: ForgotPasswordDto
  ): Promise<RecoveryResponse> => {
    const { data } = await apiClient.post<RecoveryResponse>(
      "/auth/forgot-password",
      input
    );

    return data;
  },

  resetPassword: async(
    input: ResetPasswordInput
  ): Promise<void> => {
    await apiClient.post("auth/reset-password", input);
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post("auth/verify-email", {
      token,
    });
  },

  logout: () => apiClient.post("/auth/logout").then(() => undefined),

  me: () => apiClient.get<AuthSession>("/auth/me").then((r) => r.data)
};

