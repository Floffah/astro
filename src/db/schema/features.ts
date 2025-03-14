import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const features = pgTable("features", {
    name: varchar("name", { length: 100 }).notNull().unique(),
    enabled: boolean("enabled").notNull().default(true),
});

export type Feature = typeof features.$inferSelect;
