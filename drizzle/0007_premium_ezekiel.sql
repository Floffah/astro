CREATE TYPE "public"."horoscope_period" AS ENUM('daily', 'weekly');--> statement-breakpoint
CREATE TABLE "horoscopes" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(36) NOT NULL,
	"user_id" integer NOT NULL,
	"type" "horoscope_period" NOT NULL,
	"summary" text,
	CONSTRAINT "horoscopes_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "premium" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "horoscopes" ADD CONSTRAINT "horoscopes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "cached_daily_transits";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "daily_horoscope_summary";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_transit_check";