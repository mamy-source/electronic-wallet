
import type { Request, Response } from 'express';

import { passwordResetService } from './password-reset.service.js';
import { sendSuccess } from '../../utils/response.js';

export class PasswordResetController {
  async forgotPassword(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { email } = req.body as { email: string };

    await passwordResetService.forgotPassword(email);

    sendSuccess(
      res,
      null,
      'If this account exists, a password reset email will be sent.',
    );
  }

  async resetPassword(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { token, newPassword } = req.body as {
      token: string;
      newPassword: string;
    };

    await passwordResetService.resetPassword(
      token,
      newPassword,
    );

    sendSuccess(res, null, 'Password reset successfully');
  }
}

export const passwordResetController =
  new PasswordResetController();
