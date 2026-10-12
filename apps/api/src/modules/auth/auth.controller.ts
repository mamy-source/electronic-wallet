import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";

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
                "User logged in successfully"
            )
        } catch (error) {
            next(error);
        }
    }

    //log out
    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { refreshToken } =  req.body as {refreshToken: string;};

            await authService.logout(refreshToken);

            sendSuccess(
                res,
                null,
                "User logged out successfully"
            )
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();