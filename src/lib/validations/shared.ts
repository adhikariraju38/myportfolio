import { z } from "zod";

export const objectIdString = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid id");

// Media URLs are stored as relative paths (`/api/media/<id>`), so a full
// `z.string().url()` check would reject them. Accept either an absolute URL
// or a root-relative path.
const mediaUrlString = z
  .string()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Invalid url");

export const mediaRefSchema = z
  .object({
    url: mediaUrlString.optional(),
    mediaId: objectIdString.optional(),
  })
  .partial()
  .optional();

export const socialLinkSchema = z.object({
  platform: z.string().min(1).max(40),
  url: z.string().url(),
  label: z.string().max(80).optional(),
  icon: z.string().max(40).optional(),
});

export const ctaSchema = z.object({
  label: z.string().max(80).default(""),
  href: z.string().max(300).default(""),
});

export const orderRowSchema = z.object({
  id: objectIdString,
  orderIndex: z.number().int().nonnegative(),
});

export const bulkReorderSchema = z.object({
  items: z.array(orderRowSchema).min(1),
});
