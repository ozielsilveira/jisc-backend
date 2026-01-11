import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { usersTable } from '../db/schema.js';
import { createJsonResponse, validateRequest } from '../utils/response.js';

const router = Router();

// Validation schemas
const idParamSchema = z.string().uuid('Invalid ID format');

const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
    email: z.string().email('Valid email is required').max(255, 'Email too long').toLowerCase().trim(),
});

const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim().optional(),
    email: z.string().email('Valid email is required').max(255, 'Email too long').toLowerCase().trim().optional(),
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
        idParamSchema.parse(id);
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

        if (user.length === 0) {
            res.status(404).json(createJsonResponse(false, 'User not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'User fetched successfully', user[0]));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json(createJsonResponse(false, error.message));
            return;
        }
        res.status(500).json(
            createJsonResponse(false, 'Failed to fetch user', undefined, error.message)
        );
    }
});

router.put('/api/users/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        idParamSchema.parse(id);
        const validated = validateRequest(updateUserSchema, req.body) as z.infer<
            typeof updateUserSchema
        >;

        const updateData: any = {};
        if (validated.name) updateData.name = validated.name;
        if (validated.email) updateData.email = validated.email;
        updateData.updatedAt = new Date();

        const result = await db
            .update(usersTable)
            .set(updateData)
            .where(eq(usersTable.id, id))
            .returning();

        if (result.length === 0) {
            res.status(404).json(createJsonResponse(false, 'User not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'User updated successfully', result[0]));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json(createJsonResponse(false, error.message));
            return;
        }
        res.status(400).json(
            createJsonResponse(false, 'Failed to update user', undefined, error.message)
        );
    }
});

router.delete('/api/users/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        idParamSchema.parse(id);
        const result = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();

        if (result.length === 0) {
            res.status(404).json(createJsonResponse(false, 'User not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'User deleted successfully', result[0]));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json(createJsonResponse(false, error.message));
            return;
        }
        res.status(500).json(
            createJsonResponse(false, 'Failed to delete user', undefined, error.message)
        );
    }
});

export default router;
