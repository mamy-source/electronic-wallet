import { generateAccessToken } from "../../libs/jwt.lib.js";
import hashPassword from "../../libs/argon2.lib.js";
import { hashRefreshToken } from "../../libs/refresh-token.lib.js";
import verifyPassword from "../../libs/argon2.lib.js";

import { UserRepository } from "../users/user.repository.js";
import { generateRefreshToken } from "../../libs/refresh-token.lib.js";
import { refreshTokenRepository } from "./refresh-token.repository.js";


import type { LoginUserDto, RegisterUserDto } from "@electronic-wallet/shared";
import { AppError } from "../../errors/app-error.js";
import { ERROR_CODES } from "../../errors/error-code.js";

import { EmailVerificationService } from "./email-verification.service.js";

const emailVerificationService = new EmailVerificationService;

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

        // send verification email
        await emailVerificationService.sendVerificationemail(user.id);

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
            throw new AppError("Invalid password", 401, ERROR_CODES.INVALID_CREDENTIALS);
        }

        // Block login if email is not verified
        if (!user.emailVerified) {
            throw new AppError("Please verify your email before logging in", 403, ERROR_CODES.UNAUTHORIZED);
        }

        const accesToken = generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        // generate refresh token
        const refreshToken = generateRefreshToken();

        // store only the hash of the refresh token in the database
        await refreshTokenRepository.create({
            userId: user.id,
            tokenHash: refreshToken.tokenHash,
            expiresAt: refreshToken.expiresAt,
        });

        return {
            accesToken,
            refreshToken: refreshToken.token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile,
            }
        }
    }

    //logout user
    async logout(refreshToken: string): Promise<void> {
        if (!refreshToken) {
            throw new AppError("Refresh token is required", 400, ERROR_CODES.BAD_REQUEST);
        }

        const tokenHash = hashRefreshToken(refreshToken);
        const revoked = await refreshTokenRepository.revokeByHash(tokenHash);

        if(!revoked) {
            throw new AppError("Refresh token is invalid or already revoked", 400, ERROR_CODES.BAD_REQUEST);
        }
    }
}

export const authService = new AuthService(new UserRepository());