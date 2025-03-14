#!/usr/bin/env bun
import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "@/db";

if (process.env.DATABASE_URL) {
    await migrate(db, {
        migrationsFolder: "./drizzle",
    });
}
