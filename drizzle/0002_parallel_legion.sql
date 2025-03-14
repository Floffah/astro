ALTER TABLE "users" ADD COLUMN "birth_timestamp" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birth_latitude" real;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birth_longitude" real;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cached_natal_planet_positions" json;