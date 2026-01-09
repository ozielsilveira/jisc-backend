import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { usersTable } from '../db/schema.js';
import { createJsonResponse, validateRequest } from '../utils/response.js';

const router = Router();

// Validation schemas
const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
});

router.post('/api/users', async (req: Request, res: Response) => {
    try {
        const validated = validateRequest(createUserSchema, req.body) as z.infer<
            typeof createUserSchema
        >;

        const result = await db
            .insert(usersTable)
            .values({
                name: validated.name,
                email: validated.email,
            })
            .returning();

        res.status(201).json(createJsonResponse(true, 'User created successfully', result[0]));
    } catch (error: any) {
        res.status(400).json(
            createJsonResponse(false, 'Failed to create user', undefined, error.message)
        );
    }
});

router.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await db.select().from(usersTable);
        res.status(200).json(createJsonResponse(true, 'Users fetched successfully', users));
    } catch (error: any) {
        res.status(500).json(
            createJsonResponse(false, 'Failed to fetch users', undefined, error.message)
        );
    }
});

router.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

        if (user.length === 0) {
            res.status(404).json(createJsonResponse(false, 'User not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'User fetched successfully', user[0]));
    } catch (error: any) {
        res.status(500).json(
            createJsonResponse(false, 'Failed to fetch user', undefined, error.message)
        );
    }
});

router.delete('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();

        if (result.length === 0) {
            res.status(404).json(createJsonResponse(false, 'User not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'User deleted successfully', result[0]));
    } catch (error: any) {
        res.status(500).json(
            createJsonResponse(false, 'Failed to delete user', undefined, error.message)
        );
    }
});

export default router;
