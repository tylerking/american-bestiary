CREATE TABLE "creatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"territory" text NOT NULL,
	"classification" text NOT NULL,
	"kind" text NOT NULL,
	"status" text NOT NULL,
	"abstract" text NOT NULL,
	"gloss" text NOT NULL,
	"etymology" text NOT NULL,
	"anatomy" text NOT NULL,
	"ecology" text NOT NULL,
	"behavior" text NOT NULL,
	"mythology" text NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_key" text NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creatures_slug_unique" UNIQUE("slug"),
	CONSTRAINT "creatures_territory_unique" UNIQUE("territory"),
	CONSTRAINT "creatures_kind_check" CHECK ("creatures"."kind" in ('beast', 'bird', 'serpent', 'humanoid', 'other')),
	CONSTRAINT "creatures_status_check" CHECK ("creatures"."status" in ('hoax', 'misidentification', 'folkloric', 'unexplained'))
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"path" text DEFAULT '' NOT NULL,
	"referrer" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_type_check" CHECK ("events"."type" in ('pageview', 'outbound'))
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"snapshot" jsonb NOT NULL,
	"user_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "revisions_entity_type_check" CHECK ("revisions"."entity_type" in ('creature', 'theme', 'settings'))
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_name" text NOT NULL,
	"tagline" text NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	"incipit" text NOT NULL,
	"footer_text" text DEFAULT '' NOT NULL,
	"credit_label" text DEFAULT '' NOT NULL,
	"credit_name" text DEFAULT '' NOT NULL,
	"credit_url" text DEFAULT '' NOT NULL,
	"labels" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theme_creatures" (
	"theme_id" uuid NOT NULL,
	"creature_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"note" text NOT NULL,
	CONSTRAINT "theme_creatures_theme_id_creature_id_pk" PRIMARY KEY("theme_id","creature_id"),
	CONSTRAINT "theme_creatures_position_unique" UNIQUE("theme_id","position"),
	CONSTRAINT "theme_creatures_position_check" CHECK ("theme_creatures"."position" between 1 and 4)
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"month" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "themes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "themes_month_unique" UNIQUE("month"),
	CONSTRAINT "themes_month_check" CHECK ("themes"."month" between 1 and 12)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_role_check" CHECK ("users"."role" in ('admin'))
);
--> statement-breakpoint
ALTER TABLE "revisions" ADD CONSTRAINT "revisions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_creatures" ADD CONSTRAINT "theme_creatures_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_creatures" ADD CONSTRAINT "theme_creatures_creature_id_creatures_id_fk" FOREIGN KEY ("creature_id") REFERENCES "public"."creatures"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "events_type_created_at_index" ON "events" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "revisions_entity_index" ON "revisions" USING btree ("entity_type","entity_id","created_at");