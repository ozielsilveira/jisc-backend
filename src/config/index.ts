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
} as const;
