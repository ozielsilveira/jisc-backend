import { z } from 'zod';
import { ApiResponse } from '../types/api.js';

export const createJsonResponse = <T>(
    success: boolean,
    message: string,
    data?: T,
    error?: string
): ApiResponse<T> => {
    return {
        success,
        message,
        ...(data && { data }),
        ...(error && { error }),
        timestamp: new Date().toISOString(),
    };
};

export const validateRequest = <T>(schema: z.ZodSchema, data: unknown): T => {
    return schema.parse(data);
};
