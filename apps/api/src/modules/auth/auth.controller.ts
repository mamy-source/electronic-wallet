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
      
          // Store refresh token in an HttpOnly cookie
          res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: "lax",
            path: "/api/auth",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
      
          // Remove refresh token from JSON response
          const { refreshToken, ...safeResult } = result;
      
          sendSuccess(
            res,
            safeResult,
            "User logged in successfully"
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