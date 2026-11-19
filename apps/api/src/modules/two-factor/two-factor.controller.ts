
import type { NextFunction, Request, Response } from "express";
import { twoFactorService } from "./two-factor.service.js";

import { sendCreated, sendSuccess } from "../../utils/response.js";
import env from "../../config/env.js";

import { authService } from "../auth/auth.service.js";

import type {
  EnableTwoFactorDto,
  VerifyTwoFactorDto,
  DisableTwoFactorDto,
  ResendTwoFactorCodeDto,
} from "@electronic-wallet/shared";


class TwoFactorController {
  /**
   * Récupérer le statut 2FA de l'utilisateur connecté.
   * GET /two-factor/status
   */
  getStatus = async (
    req: Request,
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
    req: Request,
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
    req: Request,
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
          const input = req.body as VerifyTwoFactorDto;

          // 1. Verify OTP
          const { userId } = await twoFactorService.verifyLogin(input);

          // 2. Generate authentication tokens
          const result = await authService.completeTwoFactorLogin(userId);

          // 3. Store refresh token in HttpOnly cookie
          res.cookie("refreshToken", result.refreshToken, {
              httpOnly: true,
              secure: env.nodeEnv === "production",
              sameSite: "lax",
              path: "/api/auth",
              maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          // 4. Remove refresh token from JSON response
          const { refreshToken, ...safeResult } = result;

          sendSuccess(
              res,
              safeResult,
              "User authenticated successfully.",
          );
      } catch (error) {
          next(error);
      }
  };


  /**
   * Demander un code OTP pour désactiver le 2FA.
   * POST /two-factor/disable/challenge
   */
  requestDisableChallenge = async (
    req: Request,
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
    req: Request,
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
    req: Request,
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
