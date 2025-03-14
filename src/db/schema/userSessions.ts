import {
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema/users";

export const userSessions = pgTable("user_sessions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),

    token: varchar("token", { length: 256 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
});

export type UserSession = typeof userSessions.$inferSelect;
