ALTER TABLE "users" ADD COLUMN "cached_daily_transits" json;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "daily_horoscope_summary" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_transit_check" timestamp with time zone;