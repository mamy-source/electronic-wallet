import { generateAccessToken } from "../../libs/jwt.lib.js";
import hashPassword from "../../libs/argon2.lib.js";
import verifyPassword from "../../libs/argon2.lib.js";

import { UserRepository } from "../users/user.repository.js";

import type { LoginUserDto, RegisterUserDto } from "./auth.type.js";
import { AppError } from "../../errors/app-error.js";
import { ERROR_CODES } from "../../errors/error-code.js";

export class AuthService {
    constructor(private userRepository: UserRepository,) {}

    //register user
    async register(data: RegisterUserDto) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError("User already exists", 409, ERROR_CODES.CONFLICT);
        }

        const hashedPassword = await hashPassword.hashPassword(data.password);

        const user = await this.userRepository.createWithProfile({
            email: data.email,
            password: hashedPassword,
            profile: {
                firstName: data.profile.firstName,
                lastName: data.profile.lastName,
                ...(data.profile.bio !== undefined && {
                    bio: data.profile.bio,
                })
            }
        });

        const accesToken = generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            accesToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile,
            }
        }


    }

    //login user
    async login(data: LoginUserDto){
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError("User not found", 404, ERROR_CODES.NOT_FOUND);
        }

        const isPasswordValid = await verifyPassword.verifyPassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const accesToken = generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            accesToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile,
            }
        }
    }
}

export const authService = new AuthService(new UserRepository());