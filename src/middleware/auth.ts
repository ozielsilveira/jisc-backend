import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { createJsonResponse } from '../utils/response.js';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json(createJsonResponse(false, 'Access token required'));
    }

    jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json(createJsonResponse(false, 'Invalid token'));
        }
        req.user = user;
        next();
    });
};