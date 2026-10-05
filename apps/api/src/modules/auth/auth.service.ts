import { generateAccessToken } from "../../libs/jwt.lib.js";
import hashPassword from "../../libs/argon2.lib.js";
import verifyPassword from "../../libs/argon2.lib.js";

import { UserRepository } from "../users/user.repository.js";

import type { LoginUserDto, RegisterUserDto } from "./auth.type.js";

export class AuthService {
    constructor(private userRepository: UserRepository,) {}

    //register user
    async register(data: RegisterUserDto) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await hashPassword.hashPassword(data.password);

        const user = await this.userRepository.createWithProfile({
            email: data.email,
            password: hashedPassword,
            firstName: data.fisrtName,
            lastName: data.lastName,
            ...(data.bio !== undefined && {
                bio: data.bio,
            })
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
            throw new Error("User not found");
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