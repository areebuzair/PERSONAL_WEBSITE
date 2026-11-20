CREATE TABLE "image-categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "image-categories" ("name");