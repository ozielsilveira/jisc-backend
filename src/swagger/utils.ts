/**
 * Utilidades para geração de documentação Swagger
 * 
 * Este arquivo fornece helpers para documentar schemas complexos
 * e manter a documentação sincronizada com os tipos TypeScript
 */

/**
 * Gera um esquema Swagger para um objeto de erro padrão
 */
export const errorSchema = {
    type: 'object',
    required: ['success', 'message', 'timestamp'],
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Error message',
        },
        error: {
            type: 'string',
            nullable: true,
            example: 'Detailed error information',
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
            example: new Date().toISOString(),
        },
    },
};

/**
 * Gera um esquema Swagger para uma resposta bem-sucedida
 */
export const successResponseSchema = (dataSchema?: any) => ({
    type: 'object',
    required: ['success', 'message', 'data', 'timestamp'],
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Operation successful',
        },
        data: dataSchema || {
            type: 'object',
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
            example: new Date().toISOString(),
        },
    },
});

/**
 * Template para documentar um endpoint GET
 */
export const getEndpointTemplate = (path: string, summary: string, tags: string[]) => ({
    get: {
        summary,
        description: `Retrieve ${summary.toLowerCase()}`,
        tags,
        responses: {
            '200': {
                description: 'Success',
            },
            '500': {
                description: 'Internal server error',
            },
        },
    },
});

/**
 * Template para documentar um endpoint POST
 */
export const postEndpointTemplate = (path: string, summary: string, tags: string[]) => ({
    post: {
        summary,
        description: `Create new ${summary.toLowerCase()}`,
        tags,
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                    },
                },
            },
        },
        responses: {
            '201': {
                description: 'Created successfully',
            },
            '400': {
                description: 'Invalid request data',
            },
            '500': {
                description: 'Internal server error',
            },
        },
    },
});

/**
 * Template para documentar um endpoint DELETE
 */
export const deleteEndpointTemplate = (path: string, summary: string, tags: string[]) => ({
    delete: {
        summary,
        description: `Delete ${summary.toLowerCase()}`,
        tags,
        responses: {
            '200': {
                description: 'Deleted successfully',
            },
            '404': {
                description: 'Resource not found',
            },
            '500': {
                description: 'Internal server error',
            },
        },
    },
});

/**
 * Gera um schema para um parâmetro de caminho UUID
 */
export const uuidPathParameter = (name: string = 'id') => ({
    name,
    in: 'path',
    required: true,
    description: `${name} UUID identifier`,
    schema: {
        type: 'string',
        format: 'uuid',
    },
});

/**
 * Gera um schema para um parâmetro de query de paginação
 */
export const paginationParameters = [
    {
        name: 'page',
        in: 'query',
        required: false,
        description: 'Page number (starting from 1)',
        schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
        },
    },
    {
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Number of items per page',
        schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20,
        },
    },
];

/**
 * Exemplo de como usar os templates em uma rota:
 * 
 * \/\**
 *  * @swagger
 *  * /api/resource:
 *  * ...getEndpointTemplate('/api/resource', 'all resources', ['Resources'])
 *  *\/
 */
