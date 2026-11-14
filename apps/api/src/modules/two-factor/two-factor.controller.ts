
import type { NextFunction, Request, Response } from "express";
import { twoFactorService } from "./two-factor.service.js";

import { sendCreated, sendSuccess } from "../../utils/response.js";

import type {
  EnableTwoFactorDto,
  VerifyTwoFactorDto,
  DisableTwoFactorDto,
  ResendTwoFactorCodeDto,
} from "@electronic-wallet/shared";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class TwoFactorController {
  /**
   * Récupérer le statut 2FA de l'utilisateur connecté.
   * GET /two-factor/status
   */
  getStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;

      const status = await twoFactorService.getStatus(userId);

      sendSuccess(res, status, "Two-factor status retrieved successfully.");
    } catch (error) {
      next(error);
    }
  };

  /**
   * Activer la configuration 2FA.
   * POST /two-factor/enable
   */
  enable = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const input = req.body as EnableTwoFactorDto;

      const result = await twoFactorService.enableTwoFactor(
        userId,
        input,
      );

      sendCreated(
        res,
        result,
        "Two-factor authentication setup initiated successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Vérifier le code OTP de configuration.
   * POST /two-factor/verify-setup
   */
  verifySetup = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const input = req.body as VerifyTwoFactorDto;

      const result = await twoFactorService.verifySetup(userId, input);

      sendSuccess(res, result, "Two-factor authentication enabled successfully.");
    } catch (error) {
      next(error);
    }
  };

  /**
   * Vérifier le code OTP lors du login.
   * POST /two-factor/login/verify
   */
  verifyLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = req.body as VerifyTwoFactorDto & {
        userId: string;
      };

      const result = await twoFactorService.verifyLogin(
        input.userId,
        {
          challengeId: input.challengeId,
          code: input.code,
        },
      );

      sendSuccess(res, result, "Two-factor verification successful.");
    } catch (error) {
      next(error);
    }
  };

  /**
   * Demander un code OTP pour désactiver le 2FA.
   * POST /two-factor/disable/challenge
   */
  requestDisableChallenge = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;

      const result = await twoFactorService.requestDisableChallenge(userId);

      sendCreated(
        res,
        result,
        "Two-factor disable verification code sent successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Désactiver le 2FA après vérification OTP.
   * POST /two-factor/disable
   */
  disable = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const input = req.body as DisableTwoFactorDto;

      const result = await twoFactorService.disableTwoFactor(
        userId,
        input,
      );

      sendSuccess(res, result, "Two-factor authentication disabled successfully.");
    } catch (error) {
      next(error);
    }
  };

  /**
   * Renvoyer un code OTP.
   * POST /two-factor/resend
   */
  resendCode = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const input = req.body as ResendTwoFactorCodeDto;

      const result = await twoFactorService.resendCode(userId, input);

      sendSuccess(res, result, "Verification code resent successfully.");
    } catch (error) {
      next(error);
    }
  };
}

export const twoFactorController = new TwoFactorController();
