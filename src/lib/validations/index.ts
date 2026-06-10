import { z } from "zod";
import { ctaSchema, mediaRefSchema, objectIdString } from "./shared";

// Hero
export const heroUpdateSchema = z
  .object({
    eyebrowText: z.string().max(80),
    name: z.string().min(1).max(120),
    title: z.string().min(1).max(120),
    tagline: z.string().max(500),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
    enable3dCanvas: z.boolean(),
  })
  .partial();

// About
const statInput = z.object({
  label: z.string().min(1).max(40),
  value: z.number(),
  suffix: z.string().max(8).default(""),
  orderIndex: z.number().int().nonnegative().default(0),
});

export const aboutUpdateSchema = z
  .object({
    heading: z.string().max(80),
    summary: z.string().min(1).max(2000),
    profileImage: mediaRefSchema,
    profileAlt: z.string().max(120),
    stats: z.array(statInput),
  })
  .partial();

// Education
export const educationUpdateSchema = z
  .object({
    school: z.string().min(1).max(160),
    degree: z.string().min(1).max(160),
    grade: z.string().max(40),
    period: z.string().max(80),
    location: z.string().max(120),
    logoImage: mediaRefSchema,
  })
  .partial();

// Home sections (bulk update)
export const homeSectionsBulkSchema = z.object({
  items: z
    .array(
      z.object({
        key: z.string(),
        isVisible: z.boolean(),
        orderIndex: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

// Nav menu items
export const navMenuItemCreateSchema = z.object({
  label: z.string().min(1).max(80),
  href: z.string().min(1).max(300),
  icon: z.string().max(40).optional(),
  location: z.enum(["header", "footer"]),
  orderIndex: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  opensInNewTab: z.boolean().default(false),
  parentId: objectIdString.nullable().optional(),
});

export const navMenuItemUpdateSchema = navMenuItemCreateSchema.partial();

export const navReorderSchema = z.object({
  items: z
    .array(z.object({ id: objectIdString, orderIndex: z.number().int().nonnegative() }))
    .min(1),
});

// Experience
const experienceType = z.enum(["full-time", "remote", "freelance", "contract", "internship"]);
export const experienceCreateSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  location: z.string().max(120).default(""),
  period: z.string().max(80).default(""),
  type: experienceType.default("full-time"),
  bullets: z.array(z.string().min(1)).default([]),
  tech: z.array(z.string()).default([]),
  orderIndex: z.number().int().nonnegative().default(0),
  isVisible: z.boolean().default(true),
});
export const experienceUpdateSchema = experienceCreateSchema.partial();

// Skill categories
export const skillCategoryCreateSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  orderIndex: z.number().int().nonnegative().default(0),
});
export const skillCategoryUpdateSchema = skillCategoryCreateSchema.partial();

// Skills
export const skillCreateSchema = z.object({
  name: z.string().min(1).max(80),
  categoryId: objectIdString,
  production: z.boolean().default(false),
  orderIndex: z.number().int().nonnegative().default(0),
});
export const skillUpdateSchema = skillCreateSchema.partial();

// Projects
export const projectCreateSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(160),
  subtitle: z.string().max(180).default(""),
  description: z.string().max(4000).default(""),
  tech: z.array(z.string()).default([]),
  metric: z.string().max(180).default(""),
  link: z.string().url().or(z.literal("")).default(""),
  github: z.string().url().or(z.literal("")).default(""),
  coverImage: mediaRefSchema,
  orderIndex: z.number().int().nonnegative().default(0),
  isPublished: z.boolean().default(true),
});
export const projectUpdateSchema = projectCreateSchema.partial();

// Publication
export const publicationCreateSchema = z.object({
  title: z.string().min(1).max(280),
  authors: z.string().min(1).max(800),
  venue: z.string().min(1).max(280),
  year: z.string().min(1).max(20),
  doi: z.string().max(120).default(""),
  description: z.string().max(2000).default(""),
  orderIndex: z.number().int().nonnegative().default(0),
  isVisible: z.boolean().default(true),
});
export const publicationUpdateSchema = publicationCreateSchema.partial();

// Open source
const contribItem = z.object({
  refId: z.string().max(40).default(""),
  title: z.string().min(1).max(140),
  severity: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  description: z.string().max(2000).default(""),
  url: z.string().url().or(z.literal("")).default(""),
});

export const openSourceCreateSchema = z.object({
  project: z.string().min(1).max(140),
  organization: z.string().max(140).default(""),
  description: z.string().max(2000).default(""),
  repoUrl: z.string().url().or(z.literal("")).default(""),
  orderIndex: z.number().int().nonnegative().default(0),
  isVisible: z.boolean().default(true),
  contributions: z.array(contribItem).default([]),
});
export const openSourceUpdateSchema = openSourceCreateSchema.partial();

// Awards
export const awardCreateSchema = z.object({
  title: z.string().min(1).max(160),
  event: z.string().max(160).default(""),
  rank: z
    .enum(["winner", "runner-up", "2nd-runner-up", "top-5", "finalist", "honorable-mention"])
    .default("finalist"),
  orderIndex: z.number().int().nonnegative().default(0),
  isVisible: z.boolean().default(true),
});
export const awardUpdateSchema = awardCreateSchema.partial();

// Certifications
export const certificationCreateSchema = z.object({
  title: z.string().min(1).max(180),
  issuer: z.string().max(160).default(""),
  link: z.string().url().or(z.literal("")).default(""),
  orderIndex: z.number().int().nonnegative().default(0),
  isVisible: z.boolean().default(true),
});
export const certificationUpdateSchema = certificationCreateSchema.partial();

// Community involvement
export const communityCreateSchema = z.object({
  role: z.string().min(1).max(120),
  org: z.string().min(1).max(180),
  year: z.string().max(20).default(""),
  description: z.string().max(800).default(""),
  orderIndex: z.number().int().nonnegative().default(0),
  isVisible: z.boolean().default(true),
});
export const communityUpdateSchema = communityCreateSchema.partial();

// Inquiry status update
export const inquiryUpdateSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

// Inquiry public submit
export const inquirySubmitSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(4000, "Message is too long"),
});

// Users
export const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  password: z.string().min(8).max(200),
  role: z.enum(["super_admin", "admin"]),
  isActive: z.boolean().default(true),
});
export const userUpdateSchema = z
  .object({
    name: z.string().min(1).max(120),
    role: z.enum(["super_admin", "admin"]),
    isActive: z.boolean(),
    password: z.string().min(8).max(200),
  })
  .partial();

// Upload
export const uploadSchema = z.object({
  filename: z.string().min(1).max(280),
  contentType: z.string().min(1).max(120),
  size: z.number().int().positive(),
});

/**
 * Run a Zod schema and return first-error-per-field for inline form display.
 * Returns {} when valid. Use in admin forms to show design-style field errors
 * before calling the mutation.
 */
export function fieldErrors<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): Record<string, string> {
  const res = schema.safeParse(data);
  if (res.success) return {};
  const out: Record<string, string> = {};
  for (const issue of res.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
