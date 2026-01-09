import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    provider: text('provider').default('magic'), // 'google', 'apple', 'magic'
    providerId: text('provider_id'),
    magicToken: text('magic_token'),
    magicTokenExpires: timestamp('magic_token_expires', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
