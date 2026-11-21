
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


/**
 * @openapi
 * /two-factor/status:
 *   get:
 *     summary: Get two-factor authentication status
 *     description: Retrieve the two-factor authentication status of the authenticated user.
 *     tags:
 *       - Two-Factor Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Two-factor status retrieved successfully.
 *       401:
 *         description: Authentication required or invalid access token.
 */
twoFactorRouter.get(
  "/status",
  protect,
  twoFactorController.getStatus,
);


/**
 * @openapi
 * /two-factor/enable:
 *   post:
 *     summary: Enable two-factor authentication
 *     description: Initiate the two-factor authentication setup process. Email is currently the only supported method.
 *     tags:
 *       - Two-Factor Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 enum:
 *                   - EMAIL
 *                 example: EMAIL
 *     responses:
 *       201:
 *         description: Two-factor authentication setup initiated successfully.
 *       400:
 *         description: Invalid request or unsupported authentication method.
 *       401:
 *         description: Authentication required or invalid access token.
 *       429:
 *         description: Too many requests.
 */
twoFactorRouter.post(
  "/enable",
  protect,
  twoFactorLimiter,
  validate(enableTwoFactorSchema),
  twoFactorController.enable,
);

/**
 * @openapi
 * /two-factor/verify-setup:
 *   post:
 *     summary: Verify two-factor authentication setup
 *     description: Verify the OTP code sent to the user's email to complete the two-factor authentication setup.
 *     tags:
 *       - Two-Factor Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - challengeId
 *               - code
 *             properties:
 *               challengeId:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 128
 *                 example: "challenge_123456"
 *               code:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: "012345"
 *     responses:
 *       200:
 *         description: Two-factor authentication enabled successfully.
 *       400:
 *         description: Invalid or expired OTP code or challenge.
 *       401:
 *         description: Authentication required or invalid access token.
 *       429:
 *         description: Too many verification attempts.
 */
twoFactorRouter.post(
  "/verify-setup",
  protect,
  verifyTwoFactorLimiter,
  validate(verifyTwoFactorSchema),
  twoFactorController.verifySetup,
);


/**
 * @openapi
 * /two-factor/login/verify:
 *   post:
 *     summary: Verify login two-factor authentication
 *     description: Verify the OTP code provided during login to complete the authentication process. On success, an access token is returned and the refresh token is stored in an HttpOnly cookie.
 *     tags:
 *       - Two-Factor Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - challengeId
 *               - code
 *             properties:
 *               challengeId:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 128
 *                 example: "challenge_123456"
 *               code:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: "012345"
 *     responses:
 *       200:
 *         description: User authenticated successfully. Authentication result returned and refresh token stored in an HttpOnly cookie.
 *       400:
 *         description: Invalid or expired OTP code or challenge.
 *       401:
 *         description: Invalid authentication challenge.
 *       429:
 *         description: Too many verification attempts.
 */
twoFactorRouter.post(
  "/login/verify",
  verifyTwoFactorLimiter,
  validate(verifyTwoFactorSchema),
  twoFactorController.verifyLogin,
);

/**
 * @openapi
 * /two-factor/disable/challenge:
 *   post:
 *     summary: Request two-factor authentication disable challenge
 *     description: Generate and send an OTP code to confirm the user's intention to disable two-factor authentication.
 *     tags:
 *       - Two-Factor Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Two-factor disable verification code sent successfully.
 *       401:
 *         description: Authentication required or invalid access token.
 *       429:
 *         description: Too many requests.
 */
twoFactorRouter.post(
  "/disable/challenge",
  protect,
  twoFactorLimiter,
  twoFactorController.requestDisableChallenge,
);

/**
 * @openapi
 * /two-factor/disable:
 *   post:
 *     summary: Disable two-factor authentication
 *     description: Verify the OTP challenge and disable two-factor authentication for the authenticated user.
 *     tags:
 *       - Two-Factor Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - challengeId
 *               - code
 *             properties:
 *               challengeId:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 128
 *                 example: "challenge_123456"
 *               code:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 example: "012345"
 *     responses:
 *       200:
 *         description: Two-factor authentication disabled successfully.
 *       400:
 *         description: Invalid or expired OTP code or challenge.
 *       401:
 *         description: Authentication required or invalid access token.
 *       429:
 *         description: Too many verification attempts.
 */
twoFactorRouter.post(
  "/disable",
  protect,
  verifyTwoFactorLimiter,
  validate(disableTwoFactorSchema),
  twoFactorController.disable,
);


/**
 * @openapi
 * /two-factor/resend:
 *   post:
 *     summary: Resend two-factor authentication OTP
 *     description: Resend an OTP code for an existing two-factor authentication challenge belonging to the authenticated user.
 *     tags:
 *       - Two-Factor Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: false
 *             required:
 *               - challengeId
 *             properties:
 *               challengeId:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 128
 *                 example: "challenge_123456"
 *     responses:
 *       200:
 *         description: Verification code resent successfully.
 *       400:
 *         description: Invalid or expired challenge.
 *       401:
 *         description: Authentication required or invalid access token.
 *       429:
 *         description: Resend cooldown or rate limit exceeded.
 */
twoFactorRouter.post(
  "/resend",
  protect,
  resendTwoFactorLimiter,
  validate(resendTwoFactorCodeSchema),
  twoFactorController.resendCode,
);

export default twoFactorRouter;
