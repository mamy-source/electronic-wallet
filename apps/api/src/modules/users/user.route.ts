
import { Router } from "express";

import { userController } from "./user.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { updateUserSchema } from "@electronic-wallet/validation";

import { protect, restrictTo } from "../auth/auth.middleware.js";

const userRouter = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve the list of all users. Only authenticated administrators can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Authentication required or invalid access token.
 *       403:
 *         description: Access forbidden. Administrator role required.
 */
userRouter.get("/", protect, restrictTo("ADMIN"), userController.getUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve the details of a specific user. Only administrators can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       401:
 *         description: Authentication required or invalid access token.
 *       403:
 *         description: Access forbidden. Administrator role required.
 *       404:
 *         description: User not found.
 */
userRouter.get("/:id", protect, restrictTo("ADMIN"), userController.getUserById);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Update the information of a specific user. Only administrators can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               profile:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                   bio:
 *                     type: string
 *                     nullable: true
 *                     example: Software developer
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Authentication required or invalid access token.
 *       403:
 *         description: Access forbidden. Administrator role required.
 *       404:
 *         description: User not found.
 */
userRouter.patch(
    "/:id",
    protect,
    restrictTo("ADMIN"),
    validate(updateUserSchema),
    userController.updateUser
);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     summary: Toggle user role
 *     description: Change the role of a specific user. Only administrators can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose role will be changed.
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *       401:
 *         description: Authentication required or invalid access token.
 *       403:
 *         description: Access forbidden. Administrator role required.
 *       404:
 *         description: User not found.
 */
userRouter.patch("/:id/role", protect, restrictTo("ADMIN"), userController.toggleUserRole);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Permanently delete a specific user. Only administrators can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete.
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       401:
 *         description: Authentication required or invalid access token.
 *       403:
 *         description: Access forbidden. Administrator role required.
 *       404:
 *         description: User not found.
 */
userRouter.delete("/:id", protect, restrictTo("ADMIN"), userController.deleteUser);

export default userRouter;
