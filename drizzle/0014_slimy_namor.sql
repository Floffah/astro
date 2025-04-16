ALTER TABLE "glance_articles" ALTER COLUMN "created_at" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "glance_articles" ALTER COLUMN "created_at" SET DEFAULT now();