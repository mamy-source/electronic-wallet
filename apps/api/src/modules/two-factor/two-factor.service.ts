
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import env from '../../config/env.js';
import { twoFactorRepository } from './two-factor.repository.js';
import { userRepository} from '../users/user.repository.js';

import {
  TwoFactorAuthMethod,
  TwoFactorPurpose,
} from '../../generated/prisma/client.js';

import type {
  EnableTwoFactorDto,
  VerifyTwoFactorDto,
  DisableTwoFactorDto,
  ResendTwoFactorCodeDto,
  TwoFactorStatus,
  TwoFactorChallengeResponse,
  TwoFactorLoginResponse,
  TwoFactorVerifyResponse,
} from '@electronic-wallet/shared';

import { AppError } from '../../errors/app-error.js';
import { sendEmail } from '../../libs/mailer.lib.js';

import { TwoFactorRepository } from './two-factor.repository.js';

/**
 * User data required by the Two-Factor service.
 */
export interface TwoFactorUser {
  id: string;
  email: string;
}

/**
 * Minimal user repository contract.
 */
export interface TwoFactorUserProvider {
  findById(userId: string): Promise<TwoFactorUser | null>;
}

/**
 * Two-Factor service dependencies.
 */
export interface TwoFactorServiceDependencies {
  repository: TwoFactorRepository;
  userRepository: TwoFactorUserProvider;
  otpHashSecret: string;
}

/**
 * Two-Factor Authentication Service.
 *
 * Responsibilities:
 * - Enable / disable 2FA.
 * - Generate and verify OTP codes.
 * - Create login challenges.
 * - Resend OTP codes.
 * - Enforce OTP expiration and attempt limits.
 * - Send OTP emails using the existing mailer.
 */
export class TwoFactorService {
  private readonly repository: TwoFactorRepository;
  private readonly userRepository: TwoFactorUserProvider;
  private readonly otpHashSecret: string;

  private readonly OTP_EXPIRATION_MINUTES = 5;
  private readonly RESEND_COOLDOWN_SECONDS = 60;
  private readonly MAX_OTP_ATTEMPTS = 5;

  private readonly MAX_FAILED_ATTEMPTS = 10;
  private readonly FAILED_ATTEMPTS_WINDOW_MINUTES = 15;

  constructor({
    repository,
    userRepository,
    otpHashSecret,
  }: TwoFactorServiceDependencies) {
    if (!otpHashSecret || otpHashSecret.length < 32) {
      throw new Error(
        'OTP_HASH_SECRET must contain at least 32 characters.',
      );
    }

    this.repository = repository;
    this.userRepository = userRepository;
    this.otpHashSecret = otpHashSecret;
  }


  /**
   * Get the current user's 2FA status.
   */
  async getStatus(userId: string): Promise<TwoFactorStatus> {
    const settings =
      await this.repository.findSettingsByUserId(userId);

    if (!settings) {
      return {
        enabled: false,
        method: null,
        enabledAt: null,
        lastUsedAt: null,
      };
    }

    return {
      enabled: settings.enabled,
      method: settings.method,
      enabledAt: settings.enabledAt?.toISOString() ?? null,
      lastUsedAt: settings.lastUsedAt?.toISOString() ?? null,
    };
  }

  /**
   * Start the 2FA activation process.
   *
   * The user receives an OTP by email.
   * 2FA is enabled only after successful OTP verification.
   */
  async enableTwoFactor(
    userId: string,
    input: EnableTwoFactorDto,
  ): Promise<TwoFactorChallengeResponse> {
    if (input.method !== 'EMAIL') {
      throw new AppError(
        'Only email authentication is currently supported.',
        400,
      );
    }

    const settings =
      await this.repository.findSettingsByUserId(userId);

    if (settings?.enabled) {
      throw new AppError(
        'Two-factor authentication is already enabled.',
        409,
      );
    }

    const user = await this.getUser(userId);

    await this.repository.upsertSettings(
      userId,
      TwoFactorAuthMethod.EMAIL,
    );

    return this.createChallenge(
      user.id,
      user.email,
      TwoFactorPurpose.SETUP,
    );
  }

  /**
   * Verify the OTP sent during activation.
   */
  async verifySetup(
    userId: string,
    input: VerifyTwoFactorDto,
  ): Promise<TwoFactorVerifyResponse> {
    await this.verifyAndComplete(
      userId,
      input.challengeId,
      input.code,
      TwoFactorPurpose.SETUP,
    );

    return { verified: true };
  }

  /**
   * Create a 2FA challenge after successful password verification.
   *
   * This method should be called by the login service only when
   * the user's credentials are valid and 2FA is enabled.
   */
  async createLoginChallenge(
    userId: string,
  ): Promise<TwoFactorLoginResponse> {
    const settings =
      await this.repository.findSettingsByUserId(userId);

    const user = await this.getUser(userId);

    const challenge = await this.createChallenge(
      user.id,
      user.email,
      TwoFactorPurpose.LOGIN,
    );

    return {
      requiresTwoFactor: true,
      challengeId: challenge.challengeId,
      expiresInSeconds: challenge.expiresInSeconds,
      resendAvailableInSeconds: challenge.resendAvailableInSeconds,
      maskedDestination: challenge.maskedDestination,
    };
  }

  /**
   * Verify the OTP during login.
   *
   * The authentication controller can issue access/refresh tokens
   * after this method returns successfully.
   */
  async verifyLogin(
    input: VerifyTwoFactorDto,
  ): Promise<{ userId: string }> {
      const challenge = await this.repository.findCodeByChallengeId(
          input.challengeId,
      );

      if (!challenge || challenge.purpose !== TwoFactorPurpose.LOGIN) {
          throw new AppError(
              "Invalid or expired verification challenge.",
              400,
          );
      }

      const userId = challenge.userId;

      await this.verifyAndComplete(
          userId,
          input.challengeId,
          input.code,
          TwoFactorPurpose.LOGIN,
      );

      return { userId };
  }
  /**
   * Start the 2FA deactivation process.
   *
   * A verification code is sent to the user's email.
   */
  async requestDisableChallenge(
    userId: string,
  ): Promise<TwoFactorChallengeResponse> {
    const settings =
      await this.repository.findSettingsByUserId(userId);

    if (!settings?.enabled) {
      throw new AppError(
        'Two-factor authentication is not enabled.',
        400,
      );
    }

    if (settings.method !== TwoFactorAuthMethod.EMAIL) {
      throw new AppError(
        'The configured two-factor method is not supported.',
        400,
      );
    }

    const user = await this.getUser(userId);

    return this.createChallenge(
      user.id,
      user.email,
      TwoFactorPurpose.DISABLE,
    );
  }

  /**
   * Verify the OTP and disable 2FA.
   */
  async disableTwoFactor(
    userId: string,
    input: DisableTwoFactorDto,
  ): Promise<TwoFactorVerifyResponse> {
    await this.verifyAndComplete(
      userId,
      input.challengeId,
      input.code,
      TwoFactorPurpose.DISABLE,
    );

    return { verified: true };
  }


  /**
   * Resend an OTP for an existing challenge.
   *
   * The same challenge ID is retained, but its OTP hash and
   * expiration are updated.
   */
  async resendCode(
    userId: string,
    input: ResendTwoFactorCodeDto,
  ): Promise<TwoFactorChallengeResponse> {
    await this.enforceFailedAttemptsLimit(userId);

    const challenge = await this.repository.findCodeById(
      input.challengeId,
      userId,
    );

    if (!challenge) {
      throw new AppError(
        'Verification challenge not found.',
        404,
      );
    }

    if (challenge.consumedAt) {
      throw new AppError(
        'This verification challenge has already been used.',
        400,
      );
    }

    if (challenge.expiresAt <= new Date()) {
      throw new AppError(
        'This verification challenge has expired.',
        400,
      );
    }

    if (challenge.channel !== TwoFactorAuthMethod.EMAIL) {
      throw new AppError(
        'The configured two-factor method is not supported.',
        400,
      );
    }

    const elapsedSeconds = Math.floor(
      (Date.now() - challenge.createdAt.getTime()) / 1000,
    );

    if (elapsedSeconds < this.RESEND_COOLDOWN_SECONDS) {
      const remainingSeconds =
        this.RESEND_COOLDOWN_SECONDS - elapsedSeconds;

      throw new AppError(
        `Please wait ${remainingSeconds} seconds before requesting another code.`,
        429,
      );
    }

    const user = await this.getUser(userId);

    const code = this.generateOtp();
    const codeHash = this.hashOtp(code);
    const expiresAt = this.getOtpExpiration();

    const updated = await this.repository.updateCodeForResend({
        challengeId: challenge.id,
        userId,
        codeHash,
        destination: user.email,
        expiresAt,
    });

    if (updated.count !== 1) {
        throw new AppError(
            'Unable to resend the verification code. Please wait before trying again.',
            429,
        );
        }

    await this.sendOtpEmail(
      user.email,
      code,
      challenge.purpose,
    );

    return {
      challengeId: challenge.id,
      expiresInSeconds: this.OTP_EXPIRATION_MINUTES * 60,
      resendAvailableInSeconds: this.RESEND_COOLDOWN_SECONDS,
      maskedDestination: this.maskEmail(user.email),
    };
  }


  /**
   * Create a new OTP challenge and send the code by email.
   */
  private async createChallenge(
    userId: string,
    email: string,
    purpose: TwoFactorPurpose,
  ): Promise<TwoFactorChallengeResponse> {
    await this.enforceFailedAttemptsLimit(userId);

    const code = this.generateOtp();
    const codeHash = this.hashOtp(code);
    const expiresAt = this.getOtpExpiration();

    const challenge = await this.repository.createCode({
      userId,
      codeHash,
      purpose,
      channel: TwoFactorAuthMethod.EMAIL,
      destination: email,
      expiresAt,
      maxAttempts: this.MAX_OTP_ATTEMPTS,
    });

    await this.sendOtpEmail(email, code, purpose);

    return {
      challengeId: challenge.id,
      expiresInSeconds: this.OTP_EXPIRATION_MINUTES * 60,
      resendAvailableInSeconds: this.RESEND_COOLDOWN_SECONDS,
      maskedDestination: this.maskEmail(email),
    };
  }


  /**
   * Verify an OTP and complete its associated operation.
   */
  private async verifyAndComplete(
    userId: string,
    challengeId: string,
    code: string,
    purpose: TwoFactorPurpose,
  ): Promise<void> {
    await this.enforceFailedAttemptsLimit(userId);

    const challenge = await this.repository.findActiveCode({
      challengeId,
      userId,
      purpose,
    });

    if (!challenge) {
      throw new AppError(
        'Invalid or expired verification challenge.',
        400,
      );
    }

    const isValid = this.compareOtp(
      code,
      challenge.codeHash,
    );

    if (!isValid) {
      await this.repository.incrementCodeAttempts(
        challengeId,
        userId,
      );

      await this.repository.recordAttempt({
        userId,
        success: false,
        method: TwoFactorAuthMethod.EMAIL,
      });

      throw new AppError(
        'Invalid verification code.',
        400,
      );
    }

    const completed = await this.repository.completeChallenge({
      challengeId,
      userId,
      purpose,
    });

    if (!completed) {
      await this.repository.recordAttempt({
        userId,
        success: false,
        method: TwoFactorAuthMethod.EMAIL,
      });

      throw new AppError(
        'This verification challenge is no longer valid.',
        400,
      );
    }

    await this.repository.recordAttempt({
      userId,
      success: true,
      method: TwoFactorAuthMethod.EMAIL,
    });
  }


  /**
   * Prevent repeated failed OTP verification attempts.
   */
  private async enforceFailedAttemptsLimit(
    userId: string,
  ): Promise<void> {
    const since = new Date(
      Date.now() -
        this.FAILED_ATTEMPTS_WINDOW_MINUTES * 60 * 1000,
    );

    const failedAttempts =
      await this.repository.countFailedAttempts(
        userId,
        since,
      );

    if (failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      throw new AppError(
        'Too many failed verification attempts. Please try again later.',
        429,
      );
    }
  }


  /**
   * Generate a cryptographically secure 6-digit OTP.
   *
   * Leading zeros are preserved.
   */
  private generateOtp(): string {
    return randomInt(0, 1_000_000)
      .toString()
      .padStart(6, '0');
  }

  /**
   * Hash the OTP using HMAC-SHA256.
   *
   * A secret is used so that a database leak does not directly
   * expose OTP hashes that can be brute-forced offline.
   */
  private hashOtp(code: string): string {
    return createHmac('sha256', this.otpHashSecret)
      .update(code)
      .digest('hex');
  }

  /**
   * Compare OTP hashes using timingSafeEqual.
   */
  private compareOtp(
    code: string,
    storedHash: string,
  ): boolean {
    const receivedHash = Buffer.from(
      this.hashOtp(code),
      'hex',
    );

    const expectedHash = Buffer.from(
      storedHash,
      'hex',
    );

    if (receivedHash.length !== expectedHash.length) {
      return false;
    }

    return timingSafeEqual(receivedHash, expectedHash);
  }

  /**
   * Calculate OTP expiration date.
   */
  private getOtpExpiration(): Date {
    return new Date(
      Date.now() + this.OTP_EXPIRATION_MINUTES * 60 * 1000,
    );
  }


  /**
   * Send an OTP email using the existing mailer.lib.ts.
   *
   * No additional Nodemailer transporter is created here.
   */
  private async sendOtpEmail(
    email: string,
    code: string,
    purpose: TwoFactorPurpose,
  ): Promise<void> {
    const purposeLabels: Record<TwoFactorPurpose, string> = {
      [TwoFactorPurpose.SETUP]: 'activation de la double authentification',
      [TwoFactorPurpose.LOGIN]: 'connexion à votre compte',
      [TwoFactorPurpose.DISABLE]: 'désactivation de la double authentification',
    };

    const purposeLabel = purposeLabels[purpose];

    const subject = 'Votre code de vérification - MONEXA';

    const text = `
Bonjour,

Vous avez demandé une vérification pour : ${purposeLabel}.

Votre code de vérification est : ${code}

Ce code expire dans ${this.OTP_EXPIRATION_MINUTES} minutes.

Ne partagez jamais ce code avec quelqu'un.

Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

MONEXA Financial Technologies
    `.trim();

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Code de vérification MONEXA</title>
        </head>

        <body style="
          margin: 0;
          padding: 24px;
          background-color: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
          color: #222;
        ">
          <div style="
            max-width: 560px;
            margin: 0 auto;
            padding: 32px;
            background-color: #ffffff;
            border-radius: 12px;
          ">
            <h2 style="margin-top: 0;">
              MONEXA
            </h2>

            <h3>Vérification de sécurité</h3>

            <p>Bonjour,</p>

            <p>
              Vous avez demandé une vérification pour :
              <strong>${purposeLabel}</strong>.
            </p>

            <p>Votre code de vérification :</p>

            <div style="
              margin: 24px 0;
              padding: 20px;
              text-align: center;
              background-color: #f3f4f6;
              border-radius: 8px;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
            ">
              ${code}
            </div>

            <p>
              Ce code expire dans
              <strong>${this.OTP_EXPIRATION_MINUTES} minutes</strong>.
            </p>

            <p>
              Pour votre sécurité, ne partagez jamais ce code.
            </p>

            <p style="color: #666; font-size: 13px;">
              Si vous n'êtes pas à l'origine de cette demande,
              ignorez cet email.
            </p>

            <hr style="
              margin: 28px 0;
              border: none;
              border-top: 1px solid #eee;
            " />

            <p style="color: #888; font-size: 12px;">
              MONEXA Financial Technologies
            </p>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }


  /**
   * Retrieve the user or throw an error.
   */
  private async getUser(
    userId: string,
  ): Promise<TwoFactorUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (!user.email) {
      throw new AppError(
        'A valid email address is required for two-factor authentication.',
        400,
      );
    }

    return user;
  }

  /**
   * Mask an email address before returning it to the frontend.
   *
   * Example:
   * mamitiana@gmail.com -> m******a@gmail.com
   */
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) {
      return '***';
    }

    if (localPart.length <= 2) {
      return `${localPart[0] ?? '*'}***@${domain}`;
    }

    const firstCharacter = localPart[0];
    const lastCharacter = localPart[localPart.length - 1];

    return `${firstCharacter}${'*'.repeat(
      Math.min(localPart.length - 2, 8),
    )}${lastCharacter}@${domain}`;
  }
}

export const twoFactorService = new TwoFactorService({
    repository: twoFactorRepository,
    userRepository,
    otpHashSecret: env.otpHashSecret,
  });
