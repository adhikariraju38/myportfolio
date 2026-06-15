CREATE TYPE "public"."award_rank" AS ENUM('winner', 'runner-up', '2nd-runner-up', 'top-5', 'finalist', 'honorable-mention');--> statement-breakpoint
CREATE TYPE "public"."experience_type" AS ENUM('full-time', 'remote', 'freelance', 'contract', 'internship');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."nav_location" AS ENUM('header', 'footer');--> statement-breakpoint
CREATE TYPE "public"."section_key" AS ENUM('hero', 'about', 'experience', 'skills', 'projects', 'publications', 'open-source', 'awards', 'education', 'contact');--> statement-breakpoint
CREATE TYPE "public"."theme_accent" AS ENUM('iris', 'lime', 'cyan', 'coral', 'cobalt', 'magenta');--> statement-breakpoint
CREATE TYPE "public"."theme_font" AS ENUM('engineered', 'geometric', 'grotesk', 'expressive');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'admin');--> statement-breakpoint
CREATE TABLE "about_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text DEFAULT 'default' NOT NULL,
	"heading" text DEFAULT 'About Me' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"profile_image" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"profile_alt" text DEFAULT '' NOT NULL,
	"stats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "about_content_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "awards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"event" text DEFAULT '' NOT NULL,
	"rank" "award_rank" DEFAULT 'finalist' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"issuer" text DEFAULT '' NOT NULL,
	"link" text DEFAULT '' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_involvements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text NOT NULL,
	"org" text NOT NULL,
	"year" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text DEFAULT 'default' NOT NULL,
	"school" text DEFAULT '' NOT NULL,
	"degree" text DEFAULT '' NOT NULL,
	"grade" text DEFAULT '' NOT NULL,
	"period" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"logo_image" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "education_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" text NOT NULL,
	"role" text NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"period" text DEFAULT '' NOT NULL,
	"type" "experience_type" DEFAULT 'full-time' NOT NULL,
	"bullets" text[] DEFAULT '{}'::text[] NOT NULL,
	"tech" text[] DEFAULT '{}'::text[] NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text DEFAULT 'default' NOT NULL,
	"eyebrow_text" text DEFAULT 'Hi, I''m' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"primary_cta" jsonb DEFAULT '{"label":"","href":""}'::jsonb NOT NULL,
	"secondary_cta" jsonb DEFAULT '{"label":"","href":""}'::jsonb NOT NULL,
	"enable_3d_canvas" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hero_content_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "home_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" "section_key" NOT NULL,
	"label" text NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "home_sections_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"ip_address" text DEFAULT '' NOT NULL,
	"user_agent" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"data" "bytea" NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"icon" text DEFAULT '' NOT NULL,
	"location" "nav_location" DEFAULT 'header' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"opens_in_new_tab" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "open_source_contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project" text NOT NULL,
	"organization" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"repo_url" text DEFAULT '' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"contributions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tech" text[] DEFAULT '{}'::text[] NOT NULL,
	"metric" text DEFAULT '' NOT NULL,
	"link" text DEFAULT '' NOT NULL,
	"github" text DEFAULT '' NOT NULL,
	"cover_image" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"authors" text NOT NULL,
	"venue" text NOT NULL,
	"year" text NOT NULL,
	"doi" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text DEFAULT 'default' NOT NULL,
	"site_title" text DEFAULT '' NOT NULL,
	"site_title_template" text DEFAULT '%s | Portfolio' NOT NULL,
	"site_description" text DEFAULT '' NOT NULL,
	"brand_short" text DEFAULT 'RKY' NOT NULL,
	"brand_full" text DEFAULT '' NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"logo_image" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"site_url" text DEFAULT 'http://localhost:3000' NOT NULL,
	"keywords" text[] DEFAULT '{}'::text[] NOT NULL,
	"twitter_handle" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"contact_location" text DEFAULT '' NOT NULL,
	"socials" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"theme_dark" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"theme_light" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"font_sans" text DEFAULT 'Geist' NOT NULL,
	"font_display" text DEFAULT 'Bricolage Grotesque' NOT NULL,
	"font_mono" text DEFAULT 'Geist Mono' NOT NULL,
	"theme_accent" "theme_accent" DEFAULT 'iris' NOT NULL,
	"theme_font" "theme_font" DEFAULT 'engineered' NOT NULL,
	"og_title" text DEFAULT '' NOT NULL,
	"og_subtitle" text DEFAULT '' NOT NULL,
	"og_chips" text[] DEFAULT '{}'::text[] NOT NULL,
	"og_bg_gradient" text DEFAULT 'linear-gradient(135deg, #08090C 0%, #0D0F13 50%, #08090C 100%)' NOT NULL,
	"og_text_color" text DEFAULT '#F2F3F5' NOT NULL,
	"og_accent_color" text DEFAULT '#8C7CFF' NOT NULL,
	"og_image" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"favicon_glyph" text DEFAULT 'R' NOT NULL,
	"favicon_bg_gradient" text DEFAULT 'linear-gradient(135deg, #8C7CFF, #6E5BFF)' NOT NULL,
	"favicon_text_color" text DEFAULT '#FFFFFF' NOT NULL,
	"favicon_image" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"enable_3d_hero" boolean DEFAULT true NOT NULL,
	"enable_3d_contact" boolean DEFAULT true NOT NULL,
	"enable_smooth_scroll" boolean DEFAULT true NOT NULL,
	"enable_custom_cursor" boolean DEFAULT true NOT NULL,
	"enable_scroll_progress" boolean DEFAULT true NOT NULL,
	"dark_mode_default" boolean DEFAULT true NOT NULL,
	"hero_particle_density" integer DEFAULT 100 NOT NULL,
	"contact_mesh_density" integer DEFAULT 100 NOT NULL,
	"footer_copyright_template" text DEFAULT '© {year} {name}' NOT NULL,
	"json_ld" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "skill_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skill_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category_id" uuid NOT NULL,
	"production" boolean DEFAULT false NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_menu_items" ADD CONSTRAINT "nav_menu_items_parent_id_nav_menu_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."nav_menu_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_skill_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."skill_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "awards_order_idx" ON "awards" USING btree ("order_index","created_at");--> statement-breakpoint
CREATE INDEX "certifications_order_idx" ON "certifications" USING btree ("order_index","created_at");--> statement-breakpoint
CREATE INDEX "community_order_idx" ON "community_involvements" USING btree ("order_index");--> statement-breakpoint
CREATE INDEX "experiences_order_idx" ON "experiences" USING btree ("order_index","created_at");--> statement-breakpoint
CREATE INDEX "inquiries_status_created_idx" ON "inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "media_created_idx" ON "media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "nav_menu_items_location_order_idx" ON "nav_menu_items" USING btree ("location","order_index");--> statement-breakpoint
CREATE INDEX "open_source_order_idx" ON "open_source_contributions" USING btree ("order_index","created_at");--> statement-breakpoint
CREATE INDEX "projects_order_idx" ON "projects" USING btree ("order_index","created_at");--> statement-breakpoint
CREATE INDEX "publications_year_order_idx" ON "publications" USING btree ("year","order_index");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "skills_category_order_idx" ON "skills" USING btree ("category_id","order_index");