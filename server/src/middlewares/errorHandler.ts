import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/errorResponse';
import logger from '../utils/logger';

export const errorHandler = (
    err: Error | ErrorResponse,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    logger.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if ((err as any).code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values((err as any).errors)
            .map((val: any) => val.message)
            .join(', ');
        error = new ErrorResponse(message, 400);
    }

    res.status((error as ErrorResponse).statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};