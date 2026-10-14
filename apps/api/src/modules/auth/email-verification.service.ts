import { prisma } from "../../config/prisma.js";
import env from "../../config/env.js";
import { generateSecureToken, hashToken } from "../../libs/token.lib.js";
import { sendEmail } from "../../libs/mailer.lib.js";

import { UserRepository } from "../users/user.repository.js";
import { emailVerificationTokenRepository } from "./email-verification-token.repository.js";
import { AppError } from "../../errors/app-error.js";
import { ERROR_CODES } from "../../errors/error-code.js";

export class EmailVerificationService {
    constructor (private readonly userRepository = new UserRepository(),){}

    async sendVerificationemail(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);

        if (!user || user.emailVerified) {
            return;
        }

        const { token, tokenHash, expiresAt } = generateSecureToken(24 *60);
        
        await emailVerificationTokenRepository.deleteAllByUserId(user.id);

        await emailVerificationTokenRepository.create({
            userId: user.id,
            tokenHash,
            expiresAt,
        });

        const verificationLink = new URL('/api/auth/verify-email', env.apiUrl);
        verificationLink.searchParams.set('token', token);

        await sendEmail({
            to: user.email,
            subject: 'Electronic Wallet - Confirmation de compte',
            text: `Bonjour ${user.profile?.firstName || ''}, Confirmez votre compte: ${verificationLink.toString()}`,
            html: `
                <p>Bonjour ${user.profile?.firstName || ''},</p>
                <p>Veuillez confirmer votre compte en cliquant sur le lien ci-dessous :</p>
                <a href="${verificationLink.toString()}">Confirmer mon compte</a>
                <p> Ce lien expirera dans 24 heures.</p>


            `,
        });
    }

    async verifyEmail(token: string): Promise<void> {
        const tokenHash = hashToken(token);

        await prisma.$transaction(async (tx) => {
            const verification =  await tx.emailVerificationToken.findUnique({
                where: {
                    tokenHash,
                    expiresAt: {
                        gt: new Date(),
                    },
                },

            });
            if (!verification || verification.expiresAt <= new Date()){
                throw new AppError("Invalid token", 401, ERROR_CODES.UNAUTHORIZED);

            }

            const deleted = await tx.emailVerificationToken.deleteMany({
                where: {
                    id: verification.id,
                    expiresAt: { gt: new Date() },
                },
            });

            if (deleted.count !== 1) {
                throw new AppError("Invalid or expired token", 401, ERROR_CODES.UNAUTHORIZED);
            }

            await tx.user.update({
                where: {id: verification.userId },
                data: { emailVerified: true },
            });

            await tx.emailVerificationToken.deleteMany({
                where: { userId: verification.userId },
            });

        });
    }

}