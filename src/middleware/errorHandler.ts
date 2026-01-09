import { NextFunction, Request, Response } from 'express';
import { config } from '../config/index.js';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (config.env === 'development') {
        console.error('Error:', err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: config.env === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString(),
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        timestamp: new Date().toISOString(),
    });
};
