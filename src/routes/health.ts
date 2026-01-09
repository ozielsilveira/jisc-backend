import { Request, Response, Router } from 'express';
import { createJsonResponse } from '../utils/response';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the server with uptime information
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *                 - timestamp
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is healthy
 *                 data:
 *                   $ref: '#/components/schemas/HealthStatus'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '500':
 *         description: Internal server error
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
 * @swagger
 * /status:
 *   get:
 *     summary: Application status endpoint
 *     description: Returns the application version, name, and current environment
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: Application is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *                 - timestamp
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Application is running
 *                 data:
 *                   $ref: '#/components/schemas/ApplicationStatus'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '500':
 *         description: Internal server error
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
