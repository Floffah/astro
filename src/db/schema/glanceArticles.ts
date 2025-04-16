import { date, pgTable, serial, text } from "drizzle-orm/pg-core";

import { publicId, updatedAt } from "@/db/schema/fields";

export const glanceArticles = pgTable("glance_articles", {
    id: serial("id").primaryKey(),
    publicId: publicId(),

    title: text("title").notNull(),
    content: text("content").notNull(),

    createdAt: date("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: updatedAt(),
});

export type GlanceArticle = typeof glanceArticles.$inferSelect;
