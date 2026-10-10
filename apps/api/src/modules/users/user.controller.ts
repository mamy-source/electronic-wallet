import type { NextFunction, Request, Response } from "express";
import { userService } from "./user.service.js";

import { sendCreated, sendSuccess  } from "../../utils/response.js";

export class UserController {
    async getUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await userService.getUsers();

            sendSuccess(
                res,
                result,
                "Users fetched successfully"
            )
        } catch (error) {
            next(error);
        }
    }

    async getUserById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = typeof req.params.id === "string" ? req.params.id : "";
            const result = await userService.getUserById(id);

            sendSuccess(
                res,
                result,
                "User fetched successfully"
            )
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = typeof req.params.id === "string" ? req.params.id : "";
            const result = await userService.updateUser(id, req.body);

            sendSuccess(
                res,
                result,
                "User updated successfully"
            )
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = typeof req.params.id === "string" ? req.params.id : "";
            const result = await userService.deleteUser(id);

            sendSuccess(
                res,
                result,
                "User deleted successfully"
            )
        } catch (error) {
            next(error);
        }
    }

    async toggleUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = typeof req.params.id === "string" ? req.params.id : "";
            const result = await userService.toggleUserRole(id);

            sendCreated(
                res,
                result,
                "User role toggled successfully"
            )
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();