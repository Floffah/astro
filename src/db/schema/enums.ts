import { pgEnum } from "drizzle-orm/pg-core";

export const horoscopePeriod = pgEnum("horoscope_period", ["daily", "weekly"]);
