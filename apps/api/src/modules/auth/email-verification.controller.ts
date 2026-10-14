
import type { Request, Response } from 'express';

import { EmailVerificationService } from './email-verification.service.js';
import { UserRepository } from '../users/user.repository.js';
import { sendSuccess } from '../../utils/response.js';

const emailVerificationService = new EmailVerificationService();
const userRepository = new UserRepository();

export class EmailVerificationController {
  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.body as { token: string };

    await emailVerificationService.verifyEmail(token);

    sendSuccess(res, null, 'Email verified successfully');
  }

  async resendVerification(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { email } = req.body as { email: string };

    const user = await userRepository.findByEmail(email);

    if (user && !user.emailVerified) {
      await emailVerificationService.sendVerificationemail(user.id);
    }

    sendSuccess(
      res,
      null,
      'If this account requires verification, an email will be sent.',
    );
  }
}

export const emailVerificationController =
  new EmailVerificationController();
