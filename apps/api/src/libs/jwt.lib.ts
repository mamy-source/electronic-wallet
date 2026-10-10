import jwt from "jsonwebtoken";
import env from "../config/env.js";

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

//generate a JWT access token with the given payload and secret
export const generateAccessToken = (payload: JwtPayload,): string => {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
    });
}

//verify a JWT access token with the given token and secret
export const verifyAccessToken = (token: string,): JwtPayload => {
    return jwt.verify(token, env.jwtSecret, ) as JwtPayload;
};
