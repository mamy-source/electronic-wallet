
import { prisma } from '../../config/prisma.js';

interface CreatePasswordResetTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export class PasswordResetTokenRepository {

  // Replace previous tokens atomically
  async replaceForUser(data: CreatePasswordResetTokenInput) {
    return prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: { userId: data.userId },
      });

      return tx.passwordResetToken.create({ data });
    });
  }

  // Consume token and reset password atomically
  async consumeAndResetPassword(
    tokenHash: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
      });

      if (!resetToken || resetToken.expiresAt <= new Date()) {
        return false;
      }

      const consumed = await tx.passwordResetToken.deleteMany({
        where: {
          id: resetToken.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (consumed.count !== 1) {
        return false;
      }

      await tx.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      });

      await tx.refreshToken.updateMany({
        where: {
          userId: resetToken.userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });

      await tx.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId },
      });

      return true;
    });
  }
}

export const passwordResetTokenRepository =
  new PasswordResetTokenRepository();
