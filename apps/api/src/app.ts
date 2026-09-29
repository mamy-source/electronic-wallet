import cors from 'cors';
import express, { type Express } from 'express';


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

export default app;