import type * as AstrocalcTypes from "~types/apis/astrocalc";
import {
    boolean,
    json,
    pgTable,
    real,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

import { createdAt, publicId, updatedAt } from "@/db/schema/fields";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    publicId: publicId(),

    email: varchar("email", { length: 320 }).notNull().unique(),

    onboarded: boolean("onboarded").default(false),

    birthTimestamp: timestamp("birth_timestamp", {
        withTimezone: true,
        mode: "date",
    }),
    birthLatitude: real("birth_latitude"),
    birthLongitude: real("birth_longitude"),

    cachedNatalPlanetPositions: json("cached_natal_planet_positions").$type<
        AstrocalcTypes.operations["calculateBirthChart"]["responses"]["200"]["content"]["application/json"]
    >(),

    summary: text("summary"),
    sunSignSummary: text("sun_sign_summary"),
    moonSignSummary: text("moon_sign_summary"),
    ascendantSignSummary: text("ascendant_sign_summary"),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
});

export type User = typeof users.$inferSelect;
