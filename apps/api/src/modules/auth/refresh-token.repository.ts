import { prisma } from "../../config/prisma.js";

interface CreateRefreshTokenInput {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
}

export class RefreshTokenRepository {
    async create(data: CreateRefreshTokenInput) {
        return prisma.refreshToken.create({
            data: {
                userId: data.userId,
                tokenHash: data.tokenHash,
                expiresAt: data.expiresAt,
                
            },
        })

    }


    // find by token hash

    async findActiveByHash(tokenHash: string) {
            return prisma.refreshToken.findFirst({
                where: {
                    tokenHash,
                    revokedAt: null,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
                include: {
                    user: true,
                },
            })
    }

    // revoke a refresh token only if it is active
    async revokeByHash(tokenHash: string): Promise<boolean> {
        const result = await prisma.refreshToken.updateMany({
            where: {
                tokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
        return result.count > 0;

    }

    // revoke all refresh tokens for a user
    async revokeAllByUserId(userId: string): Promise<number> {
        const result = await prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        })

        return result.count;
    }
}

export const refreshTokenRepository = new RefreshTokenRepository();