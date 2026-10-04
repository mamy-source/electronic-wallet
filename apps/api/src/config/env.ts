import dotenv from "dotenv";


dotenv.config();

const env = {
    port: Number(process.env.PORT || 9000),
    nodeEnv: process.env.NODE_ENV || "development",
    database: process.env.DATABASE_URL,
    frontendUrl:
    process.env.FRONTEND_URL ?? "http://localhost:3000",
    pepper: process.env.PASSSWORD_PEPPER ?? "default_pepper",

    // JWT
    jwtSecret: process.env.JWT_SECRET ?? "default_jwt_secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
}
export default env;