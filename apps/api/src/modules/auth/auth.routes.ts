import { Router } from "express";

import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";

import { loginSchema, registerSchema,
     logoutSchema, verifyEmailSchema,
     resendVerificationSchema, forgotPasswordSchema,
     resetPasswordSchema 
} from "@electronic-wallet/validation"

import { emailVerificationController } from "./email-verification.controller.js";
import { passwordResetController } from "./password-reset.controller.js";

import {
    registerLimiter, loginLimiter,
    forgotPasswordLimiter, resendVerificationLimiter,
    resetPasswordLimiter, verifyEmailLimiter 
} from "../../middleware/rate-limit.middleware.js";



const authRouter = Router();

authRouter.post('/register', 
    registerLimiter, 
    validate(registerSchema), 
    authController.register.bind(authController));

authRouter.post('/login', 
    loginLimiter, 
    validate(loginSchema), 
    authController.login.bind(authController));

authRouter.post('/logout', 
    validate(logoutSchema), 
    authController.logout.bind(authController));


authRouter.post('/verify-email', 
    verifyEmailLimiter, 
    validate(verifyEmailSchema), 

    emailVerificationController.verifyEmail.bind(emailVerificationController));
authRouter.post('/resend-verification', 
    resendVerificationLimiter, 
    validate(resendVerificationSchema), 
    emailVerificationController.resendVerification.bind(emailVerificationController));


authRouter.post('/forgot-password', 
    forgotPasswordLimiter, 
    validate(forgotPasswordSchema), 

    passwordResetController.forgotPassword.bind(passwordResetController));
authRouter.post('/reset-password',
    resetPasswordLimiter, 
    validate(resetPasswordSchema), 
    passwordResetController.resetPassword.bind(passwordResetController));

export default authRouter;