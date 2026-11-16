
export type TwoFactorMethod = 'EMAIL' | 'SMS';

export type TwoFactorPurpose =
  | 'SETUP'
  | 'LOGIN'
  | 'DISABLE';

export interface TwoFactorStatus {
  enabled: boolean;
  method: TwoFactorMethod | null;
  enabledAt: string | null;
  lastUsedAt: string | null;
}

export interface EnableTwoFactorDto {
  method: TwoFactorMethod;
}

export interface VerifyTwoFactorDto {
  code: string;
  challengeId: string;
}

export interface DisableTwoFactorDto {
  code: string;
  challengeId: string;
}

export interface ResendTwoFactorCodeDto {
  challengeId: string;
}

export interface TwoFactorChallengeResponse {
  challengeId: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
  maskedDestination: string;
}

export interface TwoFactorLoginResponse {
  requiresTwoFactor: true;
  challengeId: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
  maskedDestination: string;
}

export interface TwoFactorVerifyResponse {
  verified: boolean;
}
