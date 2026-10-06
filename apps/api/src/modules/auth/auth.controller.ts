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
            console.log('📦 BODY REÇU:', JSON.stringify(req.body, null, 2));
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
}

export const authController = new AuthController();