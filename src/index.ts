import cors from 'cors';
import express, { type Express } from 'express';
import helmetPkg from 'helmet';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/users.js';

const app: Express = express();

// Security middleware
// @ts-ignore - helmet v8 ESM compatibility issue
app.use(helmetPkg());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(requestLogger);

// Routes
app.use(healthRoutes);
app.use(userRoutes);
app.use(authRoutes);

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
