
import { Router } from "express";

import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";

import { loginSchema, registerSchema,
     logoutSchema, verifyEmailSchema,
     resendVerificationSchema, forgotPasswordSchema,
     verifyTwoFactorSchema, resetPasswordSchema 
} from "@electronic-wallet/validation"

import { emailVerificationController } from "./email-verification.controller.js";
import { passwordResetController } from "./password-reset.controller.js";

import { protect } from "../auth/auth.middleware.js";

import {
    registerLimiter, loginLimiter,
    forgotPasswordLimiter, resendVerificationLimiter,
    resetPasswordLimiter, verifyEmailLimiter,
    twoFactorLimiter, verifyTwoFactorLimiter
} from "../../middleware/rate-limit.middleware.js";

const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Créer un nouveau compte
 *     description: Crée un compte utilisateur MONEXA avec ses informations personnelles et initialise la vérification de son adresse email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - profile
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *                 format: password
 *                 example: StrongPassword123
 *               profile:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 50
 *                     example: Mamitiana
 *                   lastName:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 50
 *                     example: Randrianantenaina
 *                   bio:
 *                     type: string
 *                     maxLength: 500
 *                     example: Full-stack developer
 *     responses:
 *       "201":
 *         description: Compte créé avec succès
 *       "400":
 *         description: Données invalides
 *       "409":
 *         description: Adresse email déjà utilisée
 *       "429":
 *         description: Trop de tentatives d'inscription
 */
authRouter.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  authController.register.bind(authController),
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Connecter un utilisateur
 *     description: Authentifie un utilisateur avec son adresse email et son mot de passe. Si les identifiants sont valides, une vérification 2FA par email est initiée.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 1
 *                 format: password
 *                 example: StrongPassword123
 *     responses:
 *       "200":
 *         description: Identifiants valides, vérification 2FA requise
 *       "400":
 *         description: Données invalides
 *       "401":
 *         description: Identifiants incorrects ou compte non autorisé
 *       "429":
 *         description: Trop de tentatives de connexion
 */
authRouter.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  authController.login.bind(authController),
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Déconnecter un utilisateur
 *     description: Révoque le refresh token fourni afin de terminer la session utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 minLength: 1
 *                 example: refresh-token-value
 *     responses:
 *       "200":
 *         description: Déconnexion effectuée avec succès
 *       "400":
 *         description: Refresh token manquant ou invalide
 *       "401":
 *         description: Session non autorisée
 */
authRouter.post(
  "/logout",
  validate(logoutSchema),
  authController.logout.bind(authController),
);

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Vérifier une adresse email
 *     description: Vérifie l'adresse email d'un utilisateur à partir du token de vérification reçu par email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 minLength: 1
 *                 example: email-verification-token
 *     responses:
 *       "200":
 *         description: Adresse email vérifiée avec succès
 *       "400":
 *         description: Token invalide ou expiré
 *       "429":
 *         description: Trop de tentatives de vérification
 */
authRouter.post(
  "/verify-email",
  verifyEmailLimiter,
  validate(verifyEmailSchema),
  emailVerificationController.verifyEmail.bind(emailVerificationController),
);

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Renvoyer le code de vérification email
 *     description: Demande l'envoi d'un nouvel email de vérification à l'adresse fournie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       "200":
 *         description: Demande de renvoi traitée
 *       "400":
 *         description: Adresse email invalide
 *       "429":
 *         description: Trop de demandes de renvoi
 */
authRouter.post(
  "/resend-verification",
  resendVerificationLimiter,
  validate(resendVerificationSchema),
  emailVerificationController.resendVerification.bind(emailVerificationController),
);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Demander une réinitialisation du mot de passe
 *     description: Initie la procédure de récupération du mot de passe en envoyant un email contenant les instructions de réinitialisation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       "200":
 *         description: Demande de réinitialisation traitée
 *       "400":
 *         description: Adresse email invalide
 *       "429":
 *         description: Trop de demandes de récupération
 */
authRouter.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  passwordResetController.forgotPassword.bind(passwordResetController),
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Réinitialiser le mot de passe
 *     description: Réinitialise le mot de passe de l'utilisateur à l'aide du token reçu par email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: password-reset-token
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *                 format: password
 *                 example: NewStrongPassword123
 *     responses:
 *       "200":
 *         description: Mot de passe réinitialisé avec succès
 *       "400":
 *         description: Token invalide ou mot de passe incorrect
 *       "429":
 *         description: Trop de tentatives de réinitialisation
 */
authRouter.post(
  "/reset-password",
  resetPasswordLimiter,
  validate(resetPasswordSchema),
  passwordResetController.resetPassword.bind(passwordResetController),
);

/**
 * @openapi
 * /auth/verify-2fa:
 *   post:
 *     summary: Verify two-factor authentication login
 *     description: Verify the six-digit OTP code sent to the user's email to complete the login process.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challengeId
 *               - code
 *             properties:
 *               challengeId:
 *                 type: string
 *                 example: "challenge_123456"
 *               code:
 *                 type: string
 *                 pattern: '^[0-9]{6}$'
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Two-factor authentication successful. Access token returned and refresh token stored in an HttpOnly cookie.
 *       400:
 *         description: Invalid or expired verification code.
 *       401:
 *         description: Invalid authentication challenge.
 *       429:
 *         description: Too many verification attempts.
 */
authRouter.post(
    "/verify-2fa",
    verifyTwoFactorLimiter,
    validate(verifyTwoFactorSchema),
    authController.verifyTwoFactorLogin.bind(authController)
);

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     description: Send a new email verification link to the user's email address.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email sent successfully.
 *       400:
 *         description: Invalid email address.
 *       429:
 *         description: Too many resend requests.
 */
authRouter.post('/resend-verification', 
    resendVerificationLimiter, 
    validate(resendVerificationSchema), 
    emailVerificationController.resendVerification.bind(emailVerificationController)
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generate a new access token using the refresh token stored in an HttpOnly cookie.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *       401:
 *         description: Missing, invalid, expired, or revoked refresh token.
 */
authRouter.post(
    "/refresh",
    authController.refresh.bind(authController)
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get authenticated user
 *     description: Retrieve the profile and account information of the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user retrieved successfully.
 *       401:
 *         description: Authentication required or invalid access token.
 */
authRouter.get(
    "/me",
    protect,
    authController.me.bind(authController)
);

export default authRouter;
