import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import healthRoutes from './routes/health';
import userRoutes from './routes/users';
import { specs } from './swagger/swagger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Swagger documentation
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
        docExpansion: 'list',
        tagsSorter: 'alpha',
        operationsSorter: 'method',
    },
    customCss: '.swagger-ui .topbar { display: none }',
}));

// Routes
app.use(healthRoutes);
app.use(userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server only in development
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(config.port, () => {
        console.log(`🚀 Server running on http://localhost:${config.port}`);
        console.log(`📝 Environment: ${config.env}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });
}

export default app;
