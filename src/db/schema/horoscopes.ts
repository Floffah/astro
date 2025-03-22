import { date, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { horoscopePeriod, users } from "@/db";
import { publicId } from "@/db/schema/fields";

export const horoscopes = pgTable("horoscopes", {
    id: serial("id").primaryKey(),
    publicId: publicId(),

    userId: integer("user_id")
        .references(() => users.id, {
            onDelete: "cascade",
        })
        .notNull(),

    type: horoscopePeriod("type").notNull(),

    date: date("date", { mode: "date" }).notNull(),
    summary: text("summary"),
});

export type Horoscope = typeof horoscopes.$inferSelect;
