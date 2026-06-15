/**
 * Drizzle schema — Postgres source of truth for the Portfolio CMS.
 *
 * Migrated 1:1 from the previous Mongoose models. Conventions:
 *  - `uuid` primary keys (replaces Mongo ObjectId). The API still exposes them
 *    as the string field `id` via `lib/db/serialize.ts`, so the client contract
 *    is unchanged.
 *  - camelCase TS keys ↔ snake_case columns.
 *  - `text` for all free-form strings (Mongo strings were unbounded) — Zod still
 *    enforces lengths on the write path.
 *  - Structured sub-documents (media refs, theme tokens, socials, CTAs, stats,
 *    contributions, JSON-LD) are stored as `jsonb`; scalar string lists as
 *    `text[]`.
 *  - `createdAt`/`updatedAt` mirror Mongoose `{ timestamps: true }`;
 *    `updatedAt` auto-bumps on every `db.update()` via `$onUpdate`.
 */
import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  customType,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// ─── Shared jsonb shapes (mirror the old Mongoose sub-schemas) ──────────────

export interface MediaRef {
  url?: string;
  /** uuid of the row in the `media` table */
  mediaId?: string;
}

export interface ThemeTokens {
  background?: string;
  backgroundSecondary?: string;
  backgroundTertiary?: string;
  foreground?: string;
  foregroundSecondary?: string;
  foregroundTertiary?: string;
  accentBlue?: string;
  accentAmber?: string;
  accentEmerald?: string;
  border?: string;
  themeColor?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
  icon?: string;
}

export interface JsonLd {
  name?: string;
  jobTitle?: string;
  url?: string;
  email?: string;
  sameAs?: string[];
  knowsAbout?: string[];
  alumniOfName?: string;
  addressLocality?: string;
  addressCountry?: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface AboutStat {
  label: string;
  value: number;
  suffix?: string;
  orderIndex?: number;
}

export interface ContributionItem {
  refId?: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description?: string;
  url?: string;
}

// ─── Custom column type: bytea (raw file bytes for media) ───────────────────

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

// ─── Reusable column groups ─────────────────────────────────────────────────

/** Fresh timestamp builders per table (avoids sharing builder instances). */
function timestamps() {
  return {
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  };
}

const emptyTextArray = sql`'{}'::text[]`;

// ─── Enums ──────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["super_admin", "admin"]);
export const navLocationEnum = pgEnum("nav_location", ["header", "footer"]);
export const experienceTypeEnum = pgEnum("experience_type", [
  "full-time",
  "remote",
  "freelance",
  "contract",
  "internship",
]);
export const awardRankEnum = pgEnum("award_rank", [
  "winner",
  "runner-up",
  "2nd-runner-up",
  "top-5",
  "finalist",
  "honorable-mention",
]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["new", "read", "archived"]);
export const themeAccentEnum = pgEnum("theme_accent", [
  "iris",
  "lime",
  "cyan",
  "coral",
  "cobalt",
  "magenta",
]);
export const themeFontEnum = pgEnum("theme_font", [
  "engineered",
  "geometric",
  "grotesk",
  "expressive",
]);
export const sectionKeyEnum = pgEnum("section_key", [
  "hero",
  "about",
  "experience",
  "skills",
  "projects",
  "publications",
  "open-source",
  "awards",
  "education",
  "contact",
]);

export const SECTION_KEYS = sectionKeyEnum.enumValues;
export type SectionKey = (typeof SECTION_KEYS)[number];

// ─── Auth ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    ...timestamps(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId), index("sessions_expires_at_idx").on(t.expiresAt)],
);

// ─── Site settings (singleton, key = "default") ───────────────────────────────

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique().default("default"),

  // Branding
  siteTitle: text("site_title").notNull().default(""),
  siteTitleTemplate: text("site_title_template").notNull().default("%s | Portfolio"),
  siteDescription: text("site_description").notNull().default(""),
  brandShort: text("brand_short").notNull().default("RKY"),
  brandFull: text("brand_full").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  logoImage: jsonb("logo_image").$type<MediaRef>().notNull().default({}),

  // SEO + base
  siteUrl: text("site_url").notNull().default("http://localhost:3000"),
  keywords: text("keywords").array().notNull().default(emptyTextArray),
  twitterHandle: text("twitter_handle").notNull().default(""),

  // Contact
  contactEmail: text("contact_email").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  contactLocation: text("contact_location").notNull().default(""),

  // Socials
  socials: jsonb("socials").$type<SocialLink[]>().notNull().default([]),

  // Theme tokens
  themeDark: jsonb("theme_dark").$type<ThemeTokens>().notNull().default({}),
  themeLight: jsonb("theme_light").$type<ThemeTokens>().notNull().default({}),
  fontSans: text("font_sans").notNull().default("Geist"),
  fontDisplay: text("font_display").notNull().default("Bricolage Grotesque"),
  fontMono: text("font_mono").notNull().default("Geist Mono"),

  // Switchable accent + typeface set
  themeAccent: themeAccentEnum("theme_accent").notNull().default("iris"),
  themeFont: themeFontEnum("theme_font").notNull().default("engineered"),

  // OG image (dynamic)
  ogTitle: text("og_title").notNull().default(""),
  ogSubtitle: text("og_subtitle").notNull().default(""),
  ogChips: text("og_chips").array().notNull().default(emptyTextArray),
  ogBgGradient: text("og_bg_gradient")
    .notNull()
    .default("linear-gradient(135deg, #08090C 0%, #0D0F13 50%, #08090C 100%)"),
  ogTextColor: text("og_text_color").notNull().default("#F2F3F5"),
  ogAccentColor: text("og_accent_color").notNull().default("#8C7CFF"),
  ogImage: jsonb("og_image").$type<MediaRef>().notNull().default({}),

  // Favicon (dynamic)
  faviconGlyph: text("favicon_glyph").notNull().default("R"),
  faviconBgGradient: text("favicon_bg_gradient")
    .notNull()
    .default("linear-gradient(135deg, #8C7CFF, #6E5BFF)"),
  faviconTextColor: text("favicon_text_color").notNull().default("#FFFFFF"),
  faviconImage: jsonb("favicon_image").$type<MediaRef>().notNull().default({}),

  // Toggles
  enable3dHero: boolean("enable_3d_hero").notNull().default(true),
  enable3dContact: boolean("enable_3d_contact").notNull().default(true),
  enableSmoothScroll: boolean("enable_smooth_scroll").notNull().default(true),
  enableCustomCursor: boolean("enable_custom_cursor").notNull().default(true),
  enableScrollProgress: boolean("enable_scroll_progress").notNull().default(true),
  darkModeDefault: boolean("dark_mode_default").notNull().default(true),

  // 3D scene density (percent of baseline, 0–200)
  heroParticleDensity: integer("hero_particle_density").notNull().default(100),
  contactMeshDensity: integer("contact_mesh_density").notNull().default(100),

  // Footer
  footerCopyrightTemplate: text("footer_copyright_template").notNull().default("© {year} {name}"),

  // JSON-LD
  jsonLd: jsonb("json_ld").$type<JsonLd>().notNull().default({}),

  ...timestamps(),
});

// ─── Home sections (landing visibility + order) ───────────────────────────────

export const homeSections = pgTable("home_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: sectionKeyEnum("key").notNull().unique(),
  label: text("label").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  orderIndex: integer("order_index").notNull().default(0),
  ...timestamps(),
});

// ─── Navigation ────────────────────────────────────────────────────────────

export const navMenuItems = pgTable(
  "nav_menu_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id").references((): AnyPgColumn => navMenuItems.id, {
      onDelete: "set null",
    }),
    label: text("label").notNull(),
    href: text("href").notNull(),
    icon: text("icon").notNull().default(""),
    location: navLocationEnum("location").notNull().default("header"),
    orderIndex: integer("order_index").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    opensInNewTab: boolean("opens_in_new_tab").notNull().default(false),
    ...timestamps(),
  },
  (t) => [index("nav_menu_items_location_order_idx").on(t.location, t.orderIndex)],
);

// ─── Hero (singleton) ────────────────────────────────────────────────────────

export const heroContent = pgTable("hero_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique().default("default"),
  eyebrowText: text("eyebrow_text").notNull().default("Hi, I'm"),
  name: text("name").notNull().default(""),
  title: text("title").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  primaryCta: jsonb("primary_cta").$type<Cta>().notNull().default({ label: "", href: "" }),
  secondaryCta: jsonb("secondary_cta").$type<Cta>().notNull().default({ label: "", href: "" }),
  enable3dCanvas: boolean("enable_3d_canvas").notNull().default(true),
  ...timestamps(),
});

// ─── About (singleton) ───────────────────────────────────────────────────────

export const aboutContent = pgTable("about_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique().default("default"),
  heading: text("heading").notNull().default("About Me"),
  summary: text("summary").notNull().default(""),
  profileImage: jsonb("profile_image").$type<MediaRef>().notNull().default({}),
  profileAlt: text("profile_alt").notNull().default(""),
  stats: jsonb("stats").$type<AboutStat[]>().notNull().default([]),
  ...timestamps(),
});

// ─── Education (singleton) ───────────────────────────────────────────────────

export const education = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique().default("default"),
  school: text("school").notNull().default(""),
  degree: text("degree").notNull().default(""),
  grade: text("grade").notNull().default(""),
  period: text("period").notNull().default(""),
  location: text("location").notNull().default(""),
  logoImage: jsonb("logo_image").$type<MediaRef>().notNull().default({}),
  ...timestamps(),
});

// ─── Experience ──────────────────────────────────────────────────────────────

export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    company: text("company").notNull(),
    role: text("role").notNull(),
    location: text("location").notNull().default(""),
    period: text("period").notNull().default(""),
    type: experienceTypeEnum("type").notNull().default("full-time"),
    bullets: text("bullets").array().notNull().default(emptyTextArray),
    tech: text("tech").array().notNull().default(emptyTextArray),
    orderIndex: integer("order_index").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    ...timestamps(),
  },
  (t) => [index("experiences_order_idx").on(t.orderIndex, t.createdAt)],
);

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillCategories = pgTable("skill_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  orderIndex: integer("order_index").notNull().default(0),
  ...timestamps(),
});

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => skillCategories.id, { onDelete: "cascade" }),
    production: boolean("production").notNull().default(false),
    orderIndex: integer("order_index").notNull().default(0),
    ...timestamps(),
  },
  (t) => [index("skills_category_order_idx").on(t.categoryId, t.orderIndex)],
);

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull().default(""),
    description: text("description").notNull().default(""),
    tech: text("tech").array().notNull().default(emptyTextArray),
    metric: text("metric").notNull().default(""),
    link: text("link").notNull().default(""),
    github: text("github").notNull().default(""),
    coverImage: jsonb("cover_image").$type<MediaRef>().notNull().default({}),
    orderIndex: integer("order_index").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    ...timestamps(),
  },
  (t) => [index("projects_order_idx").on(t.orderIndex, t.createdAt)],
);

// ─── Publications ────────────────────────────────────────────────────────────

export const publications = pgTable(
  "publications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    authors: text("authors").notNull(),
    venue: text("venue").notNull(),
    year: text("year").notNull(),
    doi: text("doi").notNull().default(""),
    description: text("description").notNull().default(""),
    orderIndex: integer("order_index").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    ...timestamps(),
  },
  (t) => [index("publications_year_order_idx").on(t.year, t.orderIndex)],
);

// ─── Open-source contributions ───────────────────────────────────────────────

export const openSourceContributions = pgTable(
  "open_source_contributions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    project: text("project").notNull(),
    organization: text("organization").notNull().default(""),
    description: text("description").notNull().default(""),
    repoUrl: text("repo_url").notNull().default(""),
    orderIndex: integer("order_index").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    contributions: jsonb("contributions").$type<ContributionItem[]>().notNull().default([]),
    ...timestamps(),
  },
  (t) => [index("open_source_order_idx").on(t.orderIndex, t.createdAt)],
);

// ─── Awards ──────────────────────────────────────────────────────────────────

export const awards = pgTable(
  "awards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    event: text("event").notNull().default(""),
    rank: awardRankEnum("rank").notNull().default("finalist"),
    orderIndex: integer("order_index").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    ...timestamps(),
  },
  (t) => [index("awards_order_idx").on(t.orderIndex, t.createdAt)],
);

// ─── Certifications ──────────────────────────────────────────────────────────

export const certifications = pgTable(
  "certifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    issuer: text("issuer").notNull().default(""),
    link: text("link").notNull().default(""),
    orderIndex: integer("order_index").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    ...timestamps(),
  },
  (t) => [index("certifications_order_idx").on(t.orderIndex, t.createdAt)],
);

// ─── Community involvement ───────────────────────────────────────────────────

export const communityInvolvements = pgTable(
  "community_involvements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    role: text("role").notNull(),
    org: text("org").notNull(),
    year: text("year").notNull().default(""),
    description: text("description").notNull().default(""),
    orderIndex: integer("order_index").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    ...timestamps(),
  },
  (t) => [index("community_order_idx").on(t.orderIndex)],
);

// ─── Inquiries (public contact form) ─────────────────────────────────────────

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    status: inquiryStatusEnum("status").notNull().default("new"),
    ipAddress: text("ip_address").notNull().default(""),
    userAgent: text("user_agent").notNull().default(""),
    ...timestamps(),
  },
  (t) => [index("inquiries_status_created_idx").on(t.status, t.createdAt)],
);

// ─── Media (file bytes, replaces GridFS) ─────────────────────────────────────

export const media = pgTable(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    data: bytea("data").notNull(),
    uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("media_created_idx").on(t.createdAt)],
);

// ─── Inferred types ──────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type MediaRow = typeof media.$inferSelect;
