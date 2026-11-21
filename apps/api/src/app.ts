import cors from 'cors';
import express, { type Express } from 'express';
import cookieParser from "cookie-parser";

import authRouter from './modules/auth/auth.routes.js';
import userRouter from './modules/users/user.routes.js';
import twoFactorRouter from './modules/two-factor/two-factor.routes.js';


import errorMiddleware from './errors/error.middleware.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';


const app: Express = express();

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Enable cors for all rootes
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//auth
app.use('/api/v1/auth', authRouter);

//users
app.use('/api/v1/users', userRouter);

//2AF
app.use('/api/v1/two-factor', twoFactorRouter);

//Health check route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is healthy' });
});

// Use error middleware
app.use(errorMiddleware);

export default app;