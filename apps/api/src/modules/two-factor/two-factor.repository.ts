
import { prisma } from '../../config/prisma.js';

import {
  TwoFactorPurpose,
  TwoFactorAuthMethod,
} from '../../generated/prisma/client.js';

/**
 * Repository input types
 */

export interface CreateTwoFactorCodeInput {
  userId: string;
  codeHash: string;
  purpose: TwoFactorPurpose;
  channel: TwoFactorAuthMethod;
  destination: string;
  expiresAt: Date;
  maxAttempts?: number;
}

export interface UpdateTwoFactorCodeInput {
  challengeId: string;
  userId: string;
  codeHash: string;
  destination: string;
  expiresAt: Date;
  now?: Date;
  resendCooldownSeconds?: number;
}

export interface RecordTwoFactorAttemptInput {
  userId: string;
  success: boolean;
  method: TwoFactorAuthMethod;
  ip?: string | null;
}

export interface FindActiveCodeInput {
  challengeId: string;
  userId: string;
  purpose: TwoFactorPurpose;
  now?: Date;
}

export interface CompleteChallengeInput {
  challengeId: string;
  userId: string;
  purpose: TwoFactorPurpose;
  now?: Date;
}

/**
 * Two Factor Repository
 *
 * Responsibilities:
 * - Manage 2FA settings.
 * - Manage OTP challenges.
 * - Manage OTP attempts.
 * - Complete OTP challenges atomically.
 *
 * All database operations are handled here.
 */
export class TwoFactorRepository {
  // ============================================================
  // SETTINGS
  // ============================================================

  /**
   * Find user's two-factor settings.
   */
  async findSettingsByUserId(userId: string) {
    return prisma.userTwoFactor.findUnique({
      where: { userId },
    });
  }

  /**
   * Create or update user's two-factor settings.
   *
   * This does not enable 2FA.
   * Activation happens only after successful OTP verification.
   */
  async upsertSettings(
    userId: string,
    method: TwoFactorAuthMethod,
  ) {
    return prisma.userTwoFactor.upsert({
      where: { userId },

      create: {
        userId,
        method,
        enabled: false,
      },

      update: {
        method,
      },
    });
  }

  // ============================================================
  // OTP CHALLENGES
  // ============================================================

  /**
   * Create a new OTP challenge.
   *
   * Previous unconsumed challenges with the same purpose
   * are invalidated before creating the new one.
   */
  async createCode(input: CreateTwoFactorCodeInput) {
    const {
      userId,
      codeHash,
      purpose,
      channel,
      destination,
      expiresAt,
      maxAttempts = 5,
    } = input;

    return prisma.$transaction(async (tx) => {
      const now = new Date();

      await tx.twoFactorCode.updateMany({
        where: {
          userId,
          purpose,
          consumedAt: null,
        },

        data: {
          consumedAt: now,
        },
      });

      return tx.twoFactorCode.create({
        data: {
          userId,
          codeHash,
          purpose,
          channel,
          destination,
          expiresAt,
          maxAttempts,
          attempts: 0,
        },
      });
    });
  }

  /**
   * Find an active OTP challenge.
   *
   * Only unconsumed, non-expired challenges with remaining
   * attempts are returned.
   */
  async findActiveCode(input: FindActiveCodeInput) {
    const {
      challengeId,
      userId,
      purpose,
      now = new Date(),
    } = input;

    const challenge = await prisma.twoFactorCode.findFirst({
      where: {
        id: challengeId,
        userId,
        purpose,
        consumedAt: null,
        expiresAt: {
          gt: now,
        },
      },
    });

    if (!challenge) {
      return null;
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      return null;
    }

    return challenge;
  }

  /**
   * Find a challenge by ID and user ID.
   *
   * Used by the service to inspect expiration,
   * purpose and attempt information.
   */
  async findCodeById(
    challengeId: string,
    userId: string,
  ) {
    return prisma.twoFactorCode.findFirst({
      where: {
        id: challengeId,
        userId,
      },
    });
  }


  /**
   * Find a challenge using its ID.
   *
   * Used during login verification to retrieve the trusted userId.
   */
  async findCodeByChallengeId(challengeId: string) {
    return prisma.twoFactorCode.findUnique({
        where: {
            id: challengeId,
        },
        select: {
            userId: true,
            purpose: true,
        },
    });
  }


  /**
   * Increment the number of failed OTP attempts.
   *
   * The update is guarded against:
   * - already consumed challenges;
   * - expired challenges;
   * - challenges that have reached maxAttempts.
   */
  async incrementCodeAttempts(
    challengeId: string,
    userId: string,
  ) {
    const now = new Date();

    const challenge = await prisma.twoFactorCode.findFirst({
      where: {
        id: challengeId,
        userId,
        consumedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      select: {
        maxAttempts: true,
      },
    });

    if (!challenge) {
      return { count: 0 };
    }

    return prisma.twoFactorCode.updateMany({
      where: {
        id: challengeId,
        userId,
        consumedAt: null,
        expiresAt: {
          gt: now,
        },
        attempts: {
          lt: challenge.maxAttempts,
        },
      },

      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Update an existing challenge during OTP resend.
   *
   * The challenge ID remains unchanged.
   * Attempts are reset for the newly generated OTP.
   *
   * Returns updateMany result.
   * The service must check count === 1.
   */
  async updateCodeForResend(
    input: UpdateTwoFactorCodeInput,
  ) {
    const {
      challengeId,
      userId,
      codeHash,
      destination,
      expiresAt,
      now = new Date(),
      resendCooldownSeconds = 60,
    } = input;

    const resendAvailableAfter = new Date(
      now.getTime() - resendCooldownSeconds * 1000,
    );

    return prisma.twoFactorCode.updateMany({
      where: {
        id: challengeId,
        userId,
        consumedAt: null,

        expiresAt: {
          gt: now,
        },

        // Prevent concurrent resend requests from bypassing
        // the cooldown period.
        createdAt: {
          lte: resendAvailableAfter,
        },
      },

      data: {
        codeHash,
        destination,
        expiresAt,
        attempts: 0,
        createdAt: now,
      },
    });
  }

  // ============================================================
  // COMPLETE CHALLENGE
  // ============================================================

  /**
   * Complete an OTP challenge atomically.
   *
   * SETUP  -> Enable 2FA.
   * LOGIN  -> Update lastUsedAt.
   * DISABLE -> Disable 2FA.
   *
   * Returns false if the challenge is no longer valid.
   */
  async completeChallenge(
    input: CompleteChallengeInput,
  ): Promise<boolean> {
    const {
      challengeId,
      userId,
      purpose,
      now = new Date(),
    } = input;

    return prisma.$transaction(async (tx) => {
      // --------------------------------------------------------
      // 1. Find a valid challenge
      // --------------------------------------------------------

      const challenge = await tx.twoFactorCode.findFirst({
        where: {
          id: challengeId,
          userId,
          purpose,
          consumedAt: null,
          expiresAt: {
            gt: now,
          },
        },
      });

      if (!challenge) {
        return false;
      }

      if (challenge.attempts >= challenge.maxAttempts) {
        return false;
      }

      // --------------------------------------------------------
      // 2. Validate settings for LOGIN and DISABLE
      // --------------------------------------------------------

      if (
        purpose === TwoFactorPurpose.DISABLE
      ) {
        const settings = await tx.userTwoFactor.findUnique({
          where: { userId },
        });

        if (settings?.method !== challenge.channel) {
          return false;
        }

        // Ensure the challenge uses the configured method.
        if (settings.method !== challenge.channel) {
          return false;
        }
      }

      // --------------------------------------------------------
      // 3. Consume challenge
      // --------------------------------------------------------

      const consumed = await tx.twoFactorCode.updateMany({
        where: {
          id: challengeId,
          userId,
          purpose,
          consumedAt: null,
          expiresAt: {
            gt: now,
          },
          attempts: {
            lt: challenge.maxAttempts,
          },
        },

        data: {
          consumedAt: now,
        },
      });

      // Another request may have consumed this challenge
      // between the initial read and this update.
      if (consumed.count !== 1) {
        return false;
      }

      // --------------------------------------------------------
      // 4. Apply purpose-specific action
      // --------------------------------------------------------

      switch (purpose) {
        case TwoFactorPurpose.SETUP: {
          await tx.userTwoFactor.upsert({
            where: { userId },

            create: {
              userId,
              method: challenge.channel,
              enabled: true,
              enabledAt: now,
            },

            update: {
              method: challenge.channel,
              enabled: true,
              enabledAt: now,
            },
          });

          break;
        }

        case TwoFactorPurpose.LOGIN: {
          await tx.userTwoFactor.updateMany({
            where: { userId },

            data: {
              lastUsedAt: now,
            },
          });

          break;
        }

        case TwoFactorPurpose.DISABLE: {
          await tx.userTwoFactor.update({
            where: { userId },

            data: {
              enabled: false,
              enabledAt: null,
              lastUsedAt: null,
            },
          });

          break;
        }

        default: {
          // Throwing ensures the transaction rolls back.
          throw new Error(
            `Unsupported two-factor purpose: ${purpose}`,
          );
        }
      }

      return true;
    });
  }

  // ============================================================
  // ATTEMPT HISTORY
  // ============================================================

  /**
   * Record an OTP verification attempt.
   *
   * Stores both successful and failed attempts.
   */
  async recordAttempt(
    input: RecordTwoFactorAttemptInput,
  ) {
    const {
      userId,
      success,
      method,
      ip,
    } = input;

    return prisma.twoFactorAttempt.create({
      data: {
        userId,
        success,
        method,
        ip: ip ?? null,
      },
    });
  }

  /**
   * Retrieve user's OTP attempt history.
   */
  async findAttemptsByUserId(
    userId: string,
    limit = 20,
  ) {
    return prisma.twoFactorAttempt.findMany({
      where: { userId },

      orderBy: {
        createdAt: 'desc',
      },

      take: limit,
    });
  }

  /**
   * Count failed attempts within a time window.
   */
  async countFailedAttempts(
    userId: string,
    since: Date,
  ) {
    return prisma.twoFactorAttempt.count({
      where: {
        userId,
        success: false,
        createdAt: {
          gte: since,
        },
      },
    });
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  /**
   * Delete expired or old consumed OTP codes.
   *
   * Can be called by a scheduled cleanup task.
   */
  async deleteExpiredCodes(
    olderThan = new Date(),
  ) {
    return prisma.twoFactorCode.deleteMany({
      where: {
        OR: [
          {
            expiresAt: {
              lt: olderThan,
            },
          },
          {
            consumedAt: {
              not: null,
              lt: olderThan,
            },
          },
        ],
      },
    });
  }

  /**
   * Delete old authentication attempt history.
   */
  async deleteOldAttempts(
    olderThan: Date,
  ) {
    return prisma.twoFactorAttempt.deleteMany({
      where: {
        createdAt: {
          lt: olderThan,
        },
      },
    });
  }
}

/**
 * Repository singleton.
 */
export const twoFactorRepository = new TwoFactorRepository();
