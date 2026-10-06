import { Router } from "express";

import { userController } from "./user.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { updateUserSchema } from "./user.schema.js";

import { protect, restrictTo } from "../auth/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", protect, restrictTo("ADMIN"), userController.getUsers);
userRouter.get("/:id", protect, restrictTo("ADMIN"), userController.getUserById);

userRouter.patch("/:id", protect, restrictTo("ADMIN"), validate(updateUserSchema), userController.updateUser);
userRouter.patch("/:id/role", protect, restrictTo("ADMIN"), userController.toggleUserRole);

userRouter.delete("/:id", protect, restrictTo("ADMIN"), userController.deleteUser);

export default userRouter;

