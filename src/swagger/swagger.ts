import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JISC Backend API',
            version: '1.0.0',
            description: 'API Backend para o sistema JISC 2026',
            contact: {
                name: 'JISC Team',
                email: 'support@jisc.com',
            },
            license: {
                name: 'ISC',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: 'https://api.jisc.com',
                description: 'Production server',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier (UUID)',
                        },
                        name: {
                            type: 'string',
                            description: 'User full name',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                        },
                    },
                },
                CreateUserRequest: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            description: 'User full name',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                        },
                    },
                },
                ApiResponse: {
                    type: 'object',
                    required: ['success', 'message'],
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the request was successful',
                        },
                        message: {
                            type: 'string',
                            description: 'Response message',
                        },
                        data: {
                            type: 'object',
                            nullable: true,
                            description: 'Response data (varies by endpoint)',
                        },
                        error: {
                            type: 'string',
                            nullable: true,
                            description: 'Error message if unsuccessful',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Response timestamp',
                        },
                    },
                },
                HealthStatus: {
                    type: 'object',
                    properties: {
                        uptime: {
                            type: 'number',
                            description: 'Server uptime in seconds',
                        },
                        environment: {
                            type: 'string',
                            description: 'Current environment',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Status check timestamp',
                        },
                    },
                },
                ApplicationStatus: {
                    type: 'object',
                    properties: {
                        version: {
                            type: 'string',
                            description: 'Application version',
                        },
                        name: {
                            type: 'string',
                            description: 'Application name',
                        },
                        environment: {
                            type: 'string',
                            description: 'Current environment',
                        },
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Bearer token for API authentication',
                },
            },
        },
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoints',
            },
            {
                name: 'Users',
                description: 'User management endpoints',
            },
        ],
    },
    apis: [
        './src/routes/**/*.ts',
        './src/swagger/endpoints/*.ts',
    ],
};

export const specs = swaggerJsdoc(options);
