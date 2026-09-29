import dotenv from "dotenv";


dotenv.config();

const env = {
    port: Number(process.env.PORT || 9000),
    nodeEnv: process.env.NODE_ENV || "development",
    database: process.env.DATABASE_URL,
    frontendUrl:
    process.env.FRONTEND_URL ?? "http://localhost:3000",

}
export default env;