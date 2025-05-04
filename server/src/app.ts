import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

// Import routes
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import tagRoutes from './routes/tagRoutes';
import assetRoutes from './routes/assetRoutes';
import networkRoutes from './routes/networkRoutes';
import employeeRoutes from './routes/employeeRoutes';

const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logger

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/employees', employeeRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to RealPayTag API' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;