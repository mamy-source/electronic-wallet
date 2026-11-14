
import { Router } from "express";

import { twoFactorController } from "./two-factor.controller.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  enableTwoFactorSchema,
  verifyTwoFactorSchema,
  disableTwoFactorSchema,
  resendTwoFactorCodeSchema,
} from "@electronic-wallet/validation";

import {
  twoFactorLimiter,
  verifyTwoFactorLimiter,
  resendTwoFactorLimiter,
} from "../../middleware/rate-limit.middleware.js";

import { protect } from "../auth/auth.middleware.js";


const twoFactorRouter = Router();

// ============================================
// 2FA STATUS
// ============================================

twoFactorRouter.get(
  "/status",
  protect,
  twoFactorController.getStatus,
);

// ============================================
// ENABLE 2FA
// ============================================

twoFactorRouter.post(
  "/enable",
  protect,
  // twoFactorLimiter,
  // validate(enableTwoFactorSchema),
  twoFactorController.enable,
);

twoFactorRouter.post(
  "/verify-setup",
  protect,
  verifyTwoFactorLimiter,
  validate(verifyTwoFactorSchema),
  twoFactorController.verifySetup,
);

// ============================================
// LOGIN 2FA
// ============================================

twoFactorRouter.post(
  "/login/verify",
  verifyTwoFactorLimiter,
  validate(verifyTwoFactorSchema),
  twoFactorController.verifyLogin,
);

// ============================================
// DISABLE 2FA
// ============================================

twoFactorRouter.post(
  "/disable/challenge",
  protect,
  twoFactorLimiter,
  twoFactorController.requestDisableChallenge,
);

twoFactorRouter.post(
  "/disable",
  protect,
  verifyTwoFactorLimiter,
  validate(disableTwoFactorSchema),
  twoFactorController.disable,
);

// ============================================
// RESEND OTP
// ============================================

twoFactorRouter.post(
  "/resend",
  protect,
  resendTwoFactorLimiter,
  validate(resendTwoFactorCodeSchema),
  twoFactorController.resendCode,
);

export default twoFactorRouter;
