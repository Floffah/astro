import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const loginRequests = pgTable("login_requests", {
    id: serial("id").primaryKey(),

    email: varchar("email", { length: 320 }).notNull(),
    code: varchar("code", { length: 6 }).notNull(),
});

export type LoginRequest = typeof loginRequests.$inferSelect;
