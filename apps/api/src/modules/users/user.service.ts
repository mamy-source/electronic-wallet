import { UserRepository } from "./user.repository.js";

import { AppError } from "../../errors/app-error.js";
import { ERROR_CODES } from "../../errors/error-code.js";
import type { UpdatUserDto } from "../../../../../packages/shared/src/types/user.type.js";

export class UserService {
    constructor(private userRepository: UserRepository) {}
    async getUsers() {
        const users = await this.userRepository.findAll();

        if (!users) {
            throw new AppError("Users not found", 404, ERROR_CODES.NOT_FOUND);
        }

        return users;
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError("User not found", 404, ERROR_CODES.NOT_FOUND);
        }

        return user;
    }

    async updateUser(id: string, data: UpdatUserDto) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new AppError("User not found", 404, ERROR_CODES.NOT_FOUND);
        }

        if (data.email && data.email !== existingUser.email) {
            const emailExists = await this.userRepository.findByEmail(data.email);
            if (emailExists) {
                throw new AppError("Email already in use", 409, ERROR_CODES.CONFLICT);
            }
        }

        const updatedUser = await this.userRepository.updateUser(id, {
            email: data.email,

            profile: {
                update: {
                    firstName: data.profile.firstName,
                    lastName: data.profile.lastName,
                    ...(data.profile.bio !== undefined && {
                        bio: data.profile.bio,
                    })
                }
            }
        });

        return updatedUser;
    }

    async deleteUser(id: string) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new AppError("User not found", 404, ERROR_CODES.NOT_FOUND);
        }

        await this.userRepository.deleteUser(id);
    }

    async toggleUserRole(id: string) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new AppError("User not found", 404, ERROR_CODES.NOT_FOUND);
        }

        const newRole = existingUser.role === "USER" ? "ADMIN" : "USER";

        const updatedUser = await this.userRepository.updateUser(id, {
            role: newRole,
        });

        return updatedUser;
    }
}

export const userService = new UserService(new UserRepository());