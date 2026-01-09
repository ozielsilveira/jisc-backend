import 'dotenv/config';

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: getEnv('DATABASE_URL'),
    logLevel: process.env.LOG_LEVEL || 'info',
    googleClientId: getEnv('GOOGLE_CLIENT_ID'),
    googleClientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
    jwtSecret: getEnv('JWT_SECRET'),
    emailHost: process.env.EMAIL_HOST,
    emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
} as const;
