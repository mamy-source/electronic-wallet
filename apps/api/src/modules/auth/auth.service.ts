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

import { TwoFactorService, twoFactorService } from "../two-factor/two-factor.service.js";
import type { VerifyTwoFactorDto } from "@electronic-wallet/shared"

const emailVerificationService = new EmailVerificationService;

export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private twoFactorService : TwoFactorService
    ) {}

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

    async login(data: LoginUserDto) {
        // 1. Find user by email
        const user = await this.userRepository.findByEmail(data.email);
    
        if (!user) {
            throw new AppError(
                "Invalid email or password",
                401,
                ERROR_CODES.INVALID_CREDENTIALS
            );
        }
    
        // 2. Verify password
        const isPasswordValid = await verifyPassword.verifyPassword(
            data.password,
            user.password
        );
    
        if (!isPasswordValid) {
            throw new AppError(
                "Invalid email or password",
                401,
                ERROR_CODES.INVALID_CREDENTIALS
            );
        }
    
        // 3. Check email verification
        if (!user.emailVerified) {
            throw new AppError(
                "Please verify your email before logging in",
                403,
                ERROR_CODES.UNAUTHORIZED
            );
        }
    
        
    
        // 4. Create LOGIN OTP challenge and send email
        const challenge = await twoFactorService.createLoginChallenge(
            user.id
        );
    
        // 5. Return challenge only
        // No access token or refresh token at this stage
        return {
            requiresTwoFactor: true as const,
            challengeId: challenge.challengeId,
            expiresInSeconds: challenge.expiresInSeconds,
            resendAvailableInSeconds: challenge.resendAvailableInSeconds,
            maskedDestination: challenge.maskedDestination,
        };
    }


    async completeTwoFactorLogin(userId: string) {
        // 1. Retrieve user
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(
                "User not found",
                404,
                ERROR_CODES.NOT_FOUND
            );
        }

        // 2. Ensure email is verified
        if (!user.emailVerified) {
            throw new AppError(
                "Please verify your email before logging in",
                403,
                ERROR_CODES.UNAUTHORIZED
            );
        }

        // 3. Generate authentication tokens
        const accessToken = generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        const generatedRefreshToken = generateRefreshToken();

        // 4. Store only the refresh token hash
        await refreshTokenRepository.create({
            userId: user.id,
            tokenHash: generatedRefreshToken.tokenHash,
            expiresAt: generatedRefreshToken.expiresAt,
        });

        // 5. Return authentication result
        return {
            accessToken,
            refreshToken: generatedRefreshToken.token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
        };
    }

    async verifyTwoFactorLogin(input: VerifyTwoFactorDto) {
        // 1. Verify OTP and retrieve userId
        const { userId } = await this.twoFactorService.verifyLogin(input);
    
        // 2. Generate authentication tokens
        return this.completeTwoFactorLogin(userId);
    }


    // Refresh access token using the HttpOnly refresh token
    async refresh(refreshToken: string) {
        // 1. Check refresh token presence
        if (!refreshToken) {
            throw new AppError(
                "Refresh token is required",
                401,
                ERROR_CODES.UNAUTHORIZED
            );
        }

        // 2. Hash the received refresh token
        const tokenHash = hashRefreshToken(refreshToken);

        // 3. Find an active and non-expired refresh token
        const storedToken =
            await refreshTokenRepository.findActiveByHash(tokenHash);

        if (!storedToken) {
            throw new AppError(
                "Invalid or expired refresh token",
                401,
                ERROR_CODES.UNAUTHORIZED
            );
        }

        // 4. Generate a new access token
        const user = storedToken.user;

        const accessToken = generateAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        // 5. Return the new access token
        return {
            accessToken,
        };
    }

    // Get the currently authenticated user
    async me(userId: string) {
        // 1. Check authenticated user ID
        if (!userId) {
            throw new AppError(
                "Authentication required",
                401,
                ERROR_CODES.UNAUTHORIZED
            );
        }

        // 2. Find user by ID
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(
                "User not found",
                404,
                ERROR_CODES.NOT_FOUND
            );
        }

        // 3. Return safe user information
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.profile
                ? {
                    id: user.profile.id,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    bio: user.profile.bio,
                }
                : null,
        };
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

export const authService = new AuthService(new UserRepository(), twoFactorService);