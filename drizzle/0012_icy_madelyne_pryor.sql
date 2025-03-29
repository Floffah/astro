ALTER TABLE "users" ADD COLUMN "day_at_a_glance" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "glance_generated_at" timestamp with time zone;