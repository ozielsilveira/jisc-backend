/**
 * Tipos relacionados à documentação Swagger/OpenAPI
 */

export interface SwaggerSchema {
    type: string;
    properties?: Record<string, SwaggerSchemaProperty>;
    required?: string[];
    items?: SwaggerSchema;
    format?: string;
    description?: string;
    example?: any;
    nullable?: boolean;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    enum?: any[];
    $ref?: string;
}

export interface SwaggerSchemaProperty extends SwaggerSchema {
    description?: string;
    example?: any;
}

export interface SwaggerParameter {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required?: boolean;
    description?: string;
    schema: SwaggerSchema;
    examples?: Record<string, any>;
}

export interface SwaggerResponse {
    description: string;
    content?: {
        'application/json': {
            schema: SwaggerSchema;
            examples?: Record<string, any>;
        };
    };
}

export interface SwaggerOperation {
    summary: string;
    description?: string;
    tags?: string[];
    parameters?: SwaggerParameter[];
    requestBody?: {
        required?: boolean;
        content: {
            'application/json': {
                schema: SwaggerSchema;
                examples?: Record<string, any>;
            };
        };
    };
    responses: Record<string, SwaggerResponse>;
}

export interface SwaggerPath {
    get?: SwaggerOperation;
    post?: SwaggerOperation;
    put?: SwaggerOperation;
    patch?: SwaggerOperation;
    delete?: SwaggerOperation;
}

export interface SwaggerSpec {
    openapi: string;
    info: {
        title: string;
        version: string;
        description?: string;
        contact?: {
            name?: string;
            email?: string;
            url?: string;
        };
        license?: {
            name: string;
            url?: string;
        };
    };
    servers?: Array<{
        url: string;
        description?: string;
        variables?: Record<string, any>;
    }>;
    paths: Record<string, SwaggerPath>;
    components?: {
        schemas?: Record<string, SwaggerSchema>;
        securitySchemes?: Record<string, any>;
    };
    tags?: Array<{
        name: string;
        description?: string;
    }>;
    security?: Array<Record<string, string[]>>;
}
