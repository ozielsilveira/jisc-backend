import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { createJsonResponse, validateRequest } from '../utils/response';

const router = Router();

// Validation schemas
const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided name and email
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           examples:
 *             example1:
 *               value:
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *                 - timestamp
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '400':
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to create user
 *                 error:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users in the system
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *                 - timestamp
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific user
 *     description: Retrieves a user by their UUID identifier
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User UUID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *                 - timestamp
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user from the system by their UUID identifier
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User UUID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *                 - timestamp
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       '500':
 *         description: Internal server error
 */
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
