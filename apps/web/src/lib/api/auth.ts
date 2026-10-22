
import { apiClient } from "./clients";

import type {
  LoginUserDto,
  RegisterUserDto,
  ForgotPasswordDto,
} from "@electronic-wallet/shared";

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  tier: string;
  requires2FA?: boolean;
}

export interface RecoveryResponse {
  message: string;
}

export const authApi = {
  login: async (input: LoginUserDto): Promise<AuthSession> => {
    const { data } = await apiClient.post<AuthSession>(
      "/auth/login",
      input
    );

    return data;
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
};
