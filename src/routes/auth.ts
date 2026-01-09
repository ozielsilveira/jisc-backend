import { eq, or } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { z } from 'zod';
import { config } from '../config/index.js';
import { db } from '../db/index.js';
import { usersTable } from '../db/schema.js';
import { createJsonResponse, validateRequest } from '../utils/response.js';

const router = Router();

// Configure Passport
passport.use(new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: `${config.frontendUrl}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('No email found'));

        let user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
        if (user.length === 0) {
            // Create new user
            const newUser = await db.insert(usersTable).values({
                name: profile.displayName,
                email,
                provider: 'google',
                providerId: profile.id,
            }).returning();
            return done(null, newUser[0]);
        } else {
            // Update if provider not set
            if (!user[0].provider) {
                await db.update(usersTable).set({ provider: 'google', providerId: profile.id }).where(eq(usersTable.id, user[0].id));
            }
            return done(null, user[0]);
        }
    } catch (error) {
        return done(error);
    }
}));


// Magic Link Schema
const magicLinkSchema = z.object({
    email: z.string().email('Valid email is required'),
});

// Send Magic Link
router.post('/auth/magic-link', async (req: Request, res: Response) => {
    try {
        const validated = validateRequest(magicLinkSchema, req.body) as z.infer<typeof magicLinkSchema>;
        const { email } = validated;

        const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '15m' });
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Check if user exists
        let user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
        if (user.length === 0) {
            // Create user with magic token
            await db.insert(usersTable).values({
                name: email.split('@')[0], // Placeholder name
                email,
                provider: 'magic',
                magicToken: token,
                magicTokenExpires: expiresAt,
            });
        } else {
            // Update existing user
            await db.update(usersTable).set({
                magicToken: token,
                magicTokenExpires: expiresAt,
            }).where(eq(usersTable.id, user[0].id));
        }

        // Send email (temporarily using console.log for testing)
        const magicLink = `${config.frontendUrl}/auth/magic-link?token=${token}`;

        const transporter = nodemailer.createTransport({
            host: config.emailHost,
            port: config.emailPort,
            secure: false,
            auth: {
                user: config.emailUser,
                // get password from: myaccount.google.com/apppasswords
                pass: config.emailPass,
            },
        });

        await transporter.sendMail({
            from: config.emailUser,
            to: email,
            subject: 'Your Magic Link',
            text: `Click here to sign in: ${magicLink}`,
            html: `<p>Click <a href="${magicLink}">here</a> to sign in.</p>`,
        });

        res.json(createJsonResponse(true, 'Magic link sent'));
    } catch (error: any) {
        console.error('Error sending magic link:', error);
        res.status(500).json(createJsonResponse(false, 'Failed to send magic link', undefined, error.message));
    }
});

// Verify Magic Link
router.get('/auth/magic-link', async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json(createJsonResponse(false, 'Token required'));

        const decoded = jwt.verify(token as string, config.jwtSecret) as { email: string };
        const user = await db.select().from(usersTable).where(
            or(
                eq(usersTable.email, decoded.email),
                eq(usersTable.magicToken, token as string)
            )
        ).limit(1);

        if (user.length === 0 || !user[0].magicTokenExpires || user[0].magicTokenExpires < new Date()) {
            return res.status(400).json(createJsonResponse(false, 'Invalid or expired token'));
        }

        // Clear token
        await db.update(usersTable).set({ magicToken: null, magicTokenExpires: null }).where(eq(usersTable.id, user[0].id));

        const jwtToken = jwt.sign({ id: user[0].id, email: user[0].email }, config.jwtSecret, { expiresIn: '7d' });
        res.json(createJsonResponse(true, 'Authenticated', { token: jwtToken, user: user[0] }));
    } catch (error: any) {
        res.status(500).json(createJsonResponse(false, 'Authentication failed', undefined, error.message));
    }
});

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${config.frontendUrl}/login` }), (req: Request, res: Response) => {
    const user = req.user as any;
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
    res.redirect(`${config.frontendUrl}/auth/callback?token=${token}`);
});

// Logout
router.post('/auth/logout', (req: Request, res: Response) => {
    // For JWT, logout is client-side by removing token
    res.json(createJsonResponse(true, 'Logged out'));
});

export default router;

