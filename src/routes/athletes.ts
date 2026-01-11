import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { athletesTable } from '../db/schema.js';
import { createJsonResponse, validateRequest } from '../utils/response.js';

const router = Router();

// Validation schemas
const idParamSchema = z.string().uuid('Invalid ID format');

const createAthleteSchema = z.object({
    userId: z.string().uuid('Valid user ID is required'),
    fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long').trim(),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid date is required'),
    cpf: z.string().min(1, 'CPF is required').max(20, 'CPF too long').trim(),
    phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number too long').trim(),
});

const updateAthleteSchema = z.object({
    fullName: z.string().min(1, 'Full name is required').max(100, 'Full name too long').trim().optional(),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid date is required').optional(),
    cpf: z.string().min(1, 'CPF is required').max(20, 'CPF too long').trim().optional(),
    phone: z.string().min(1, 'Phone number is required').max(20, 'Phone number too long').trim().optional(),
});

router.post('/api/athletes', async (req: Request, res: Response) => {
    try {
        const validated = validateRequest(createAthleteSchema, req.body) as z.infer<
            typeof createAthleteSchema
        >;

        const result = await db
            .insert(athletesTable)
            .values({
                userId: validated.userId,
                fullName: validated.fullName,
                dateOfBirth: new Date(validated.dateOfBirth),
                cpf: validated.cpf,
                phone: validated.phone,
            })
            .returning();

        res.status(201).json(createJsonResponse(true, 'Athlete created successfully', result[0]));
    } catch (error: any) {
        res.status(400).json(
            createJsonResponse(false, 'Failed to create athlete', undefined, error.message)
        );
    }
});

router.get('/api/athletes', async (req: Request, res: Response) => {
    try {
        const athletes = await db.select().from(athletesTable);
        res.status(200).json(createJsonResponse(true, 'Athletes fetched successfully', athletes));
    } catch (error: any) {
        res.status(500).json(
            createJsonResponse(false, 'Failed to fetch athletes', undefined, error.message)
        );
    }
});

router.get('/api/athletes/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        idParamSchema.parse(id);
        const athlete = await db.select().from(athletesTable).where(eq(athletesTable.id, id));

        if (athlete.length === 0) {
            res.status(404).json(createJsonResponse(false, 'Athlete not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'Athlete fetched successfully', athlete[0]));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json(createJsonResponse(false, error.message));
            return;
        }
        res.status(500).json(
            createJsonResponse(false, 'Failed to fetch athlete', undefined, error.message)
        );
    }
});

router.put('/api/athletes/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        idParamSchema.parse(id);
        const validated = validateRequest(updateAthleteSchema, req.body) as z.infer<
            typeof updateAthleteSchema
        >;

        const updateData: any = {};
        if (validated.fullName) updateData.fullName = validated.fullName;
        if (validated.dateOfBirth) updateData.dateOfBirth = new Date(validated.dateOfBirth);
        if (validated.cpf) updateData.cpf = validated.cpf;
        if (validated.phone) updateData.phone = validated.phone;
        updateData.updatedAt = new Date();

        const result = await db
            .update(athletesTable)
            .set(updateData)
            .where(eq(athletesTable.id, id))
            .returning();

        if (result.length === 0) {
            res.status(404).json(createJsonResponse(false, 'Athlete not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'Athlete updated successfully', result[0]));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json(createJsonResponse(false, error.message));
            return;
        }
        res.status(400).json(
            createJsonResponse(false, 'Failed to update athlete', undefined, error.message)
        );
    }
});

router.delete('/api/athletes/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        idParamSchema.parse(id);
        const result = await db.delete(athletesTable).where(eq(athletesTable.id, id)).returning();

        if (result.length === 0) {
            res.status(404).json(createJsonResponse(false, 'Athlete not found'));
            return;
        }

        res.status(200).json(createJsonResponse(true, 'Athlete deleted successfully', result[0]));
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json(createJsonResponse(false, error.message));
            return;
        }
        res.status(500).json(
            createJsonResponse(false, 'Failed to delete athlete', undefined, error.message)
        );
    }
});

export default router;