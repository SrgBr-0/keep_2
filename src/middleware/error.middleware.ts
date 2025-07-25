import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.error('Request error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        body: req.body
    });

    if (res.headersSent) {
        return next(error);
    }

    const status = error.status || 500;
    res.status(status).json({
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        path: req.url
    });
}