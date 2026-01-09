import { ApiResponse } from '@/types/api';
import { z } from 'zod';

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
