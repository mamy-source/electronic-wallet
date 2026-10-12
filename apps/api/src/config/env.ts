import dotenv from "dotenv";
import type { SignOptions } from 'jsonwebtoken';


dotenv.config();

const env = {
    port: Number(process.env.PORT || 9000),
    nodeEnv: process.env.NODE_ENV || "development",
    database: process.env.DATABASE_URL,
    frontendUrl:
    process.env.FRONTEND_URL ?? "http://localhost:3000",
    pepper: process.env.PASSSWORD_PEPPER ?? "default_pepper",

    // JWT
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] || "1h",


    // SMTP 
    smtpHost: process.env.SMTP_HOST as string,
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || false,
    emailFrom: process.env.MAIL_FROM as string,

    
}

console.log('SMTP CONFIG:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    from: process.env.MAIL_FROM,
  });
export default env;