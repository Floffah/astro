CREATE TABLE "glance_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(36) NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "glance_articles_public_id_unique" UNIQUE("public_id")
);
