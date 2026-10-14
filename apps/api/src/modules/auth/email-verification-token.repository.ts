import { prisma } from "../../config/prisma.js";



interface CreateEmailVerificationTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export class EmailVerificationTokenRepository {
  async create(data: CreateEmailVerificationTokenInput) {
    return prisma.emailVerificationToken.create({
      data,
    });
  }

  async findActiveByHash(tokenHash: string) {
    return prisma.emailVerificationToken.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });
  }

  async deleteAllByUserId(userId: string) {
    return prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });
  }
}

export const emailVerificationTokenRepository =
  new EmailVerificationTokenRepository();