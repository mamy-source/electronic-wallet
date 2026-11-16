import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import env from "../../config/env.js";

import { sendCreated, sendSuccess } from "../../utils/response.js";


export class AuthController {
    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await authService.register(req.body);

            sendCreated(
                res,
                result,
                "User registered successfully"
            )
        } catch (error) {
            next(error);
        }
    }

    async login(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          const result = await authService.login(req.body);
      
          sendSuccess(
            res,
            result,
            "OTP verification required to complete login"
          );
        } catch (error) {
          next(error);
        }
      }
    
      // Verify OTP - Complete Login
    async verifyTwoFactorLogin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await authService.verifyTwoFactorLogin(
                req.body
            );

            const { refreshToken, ...responseData } = result;

            // Store refresh token in an HttpOnly cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: env.nodeEnv === "production",
                sameSite: "lax",
                path: "/api/auth",
            });

            sendSuccess(
                res,
                responseData,
                "Two-factor authentication successful"
            );
        } catch (error) {
            next(error);
        }
    }


    // Refresh access token
    async refresh(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const refreshToken = req.cookies?.refreshToken;

            const result = await authService.refresh(refreshToken);

            sendSuccess(
                res,
                result,
                "Access token refreshed successfully"
            );
        } catch (error) {
            next(error);
        }
    }

    // Get currently authenticated user
    async me(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // req.user is populated by the protect middleware
            if (!req.user) {
                throw new Error("User is not authenticated");
            }
            const userId = req.user.id;

            const result = await authService.me(userId);

            sendSuccess(
                res,
                result,
                "Authenticated user retrieved successfully"
            );
        } catch (error) {
            next(error);
        }
    }


    // Logout
    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
        const refreshToken = req.cookies?.refreshToken;
    
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
    
        // Clear refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: "lax",
            path: "/api/auth",
        });
    
        sendSuccess(
            res,
            null,
            "User logged out successfully"
        );
        } catch (error) {
        next(error);
        }
    }
}

export const authController = new AuthController();