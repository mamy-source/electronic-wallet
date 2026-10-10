import cors from 'cors';
import express, { type Express } from 'express';

import authRouter from './modules/auth/auth.routes.js';
import userRouter from './modules/users/user.route.js';


import errorMiddleware from './errors/error.middleware.js';

const app: Express = express();

// Enable cors for all rootes
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//auth
app.use('/api/auth', authRouter);

//users
app.use('/api/users', userRouter);

//Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is healthy' });
});

// Use error middleware
app.use(errorMiddleware);

export default app;