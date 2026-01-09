import { Router, Request, Response } from 'express';
import { createJsonResponse } from '@/utils/response';

const router = Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json(
    createJsonResponse(true, 'Server is healthy', {
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  );
});

/**
 * GET /status
 * Application status endpoint
 */
router.get('/status', (req: Request, res: Response) => {
  res.status(200).json(
    createJsonResponse(true, 'Application is running', {
      version: '1.0.0',
      name: 'JISC Backend API',
      environment: process.env.NODE_ENV,
    })
  );
});

export default router;
