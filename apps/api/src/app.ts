import cors from 'cors';
import express, { type Express } from 'express';

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

//Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is healthy' });
});

// Use error middleware
app.use(errorMiddleware);

export default app;