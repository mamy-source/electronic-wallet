
import env from '../../config/env.js';

import argon2Lib from '../../libs/argon2.lib.js';
import { sendEmail } from '../../libs/mailer.lib.js';
import {
  generateSecureToken,
  hashToken,
} from '../../libs/token.lib.js';

import { UserRepository } from '../users/user.repository.js';
import { passwordResetTokenRepository } from './password-reset.repository.js';
import { AppError } from '../../errors/app-error.js';

export class PasswordResetService {
  constructor(
    private readonly userRepository = new UserRepository(),
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    // Do not reveal whether the account exists.
    if (!user) return;

    const { token, tokenHash, expiresAt } =
      generateSecureToken(15);

    await passwordResetTokenRepository.replaceForUser({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const url = new URL('/reset-password', env.frontendUrl);
    url.searchParams.set('token', token);

    await sendEmail({
      to: user.email,
      subject: 'Electronic Wallet - Réinitialisation du mot de passe',
      text: `Réinitialisez votre mot de passe : ${url.toString()}`,
      html: `
        <h2>Réinitialisation du mot de passe</h2>
        <p>Une demande de réinitialisation a été effectuée.</p>
        <p>
          <a href="${url.toString()}">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Ce lien expire dans 15 minutes.</p>
        <p>Si vous n'avez pas demandé cette opération, ignorez cet email.</p>
      `,
    });
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const tokenHash = hashToken(token);

    const hashedPassword =
      await argon2Lib.hashPassword(newPassword);

    const success =
      await passwordResetTokenRepository.consumeAndResetPassword(
        tokenHash,
        hashedPassword,
      );

    if (!success) {
      throw new AppError(
        'Invalid or expired password reset token',
        400,
      );
    }
  }
}

export const passwordResetService = new PasswordResetService();
