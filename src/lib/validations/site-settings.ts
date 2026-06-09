import { z } from "zod";
import { mediaRefSchema, socialLinkSchema } from "./shared";

const themeTokens = z
  .object({
    background: z.string().optional(),
    backgroundSecondary: z.string().optional(),
    backgroundTertiary: z.string().optional(),
    foreground: z.string().optional(),
    foregroundSecondary: z.string().optional(),
    foregroundTertiary: z.string().optional(),
    accentBlue: z.string().optional(),
    accentAmber: z.string().optional(),
    accentEmerald: z.string().optional(),
    border: z.string().optional(),
    themeColor: z.string().optional(),
  })
  .partial();

const jsonLdSchema = z
  .object({
    name: z.string().optional(),
    jobTitle: z.string().optional(),
    url: z.string().optional(),
    email: z.string().optional(),
    sameAs: z.array(z.string()).optional(),
    knowsAbout: z.array(z.string()).optional(),
    alumniOfName: z.string().optional(),
    addressLocality: z.string().optional(),
    addressCountry: z.string().optional(),
  })
  .partial();

export const siteSettingsUpdateSchema = z
  .object({
    siteTitle: z.string().min(1).max(120),
    siteTitleTemplate: z.string().max(140),
    siteDescription: z.string().max(500),
    brandShort: z.string().min(1).max(20),
    brandFull: z.string().max(120),
    tagline: z.string().max(280),
    logoImage: mediaRefSchema,

    siteUrl: z.string().url().or(z.literal("")),
    keywords: z.array(z.string()).max(40),
    twitterHandle: z.string().max(40),

    contactEmail: z.string().email().or(z.literal("")),
    contactPhone: z.string().max(40),
    contactLocation: z.string().max(120),

    socials: z.array(socialLinkSchema),

    themeDark: themeTokens,
    themeLight: themeTokens,
    fontSans: z.string().max(40),
    fontDisplay: z.string().max(40),
    fontMono: z.string().max(40),

    themeAccent: z.enum(["iris", "lime", "cyan", "coral", "cobalt", "magenta"]),
    themeFont: z.enum(["engineered", "geometric", "grotesk", "expressive"]),

    ogTitle: z.string().max(120),
    ogSubtitle: z.string().max(140),
    ogChips: z.array(z.string()).max(8),
    ogBgGradient: z.string().max(280),
    ogTextColor: z.string().max(24),
    ogAccentColor: z.string().max(24),
    ogImage: mediaRefSchema,

    faviconGlyph: z.string().max(4),
    faviconBgGradient: z.string().max(280),
    faviconTextColor: z.string().max(24),
    faviconImage: mediaRefSchema,

    enable3dHero: z.boolean(),
    enable3dContact: z.boolean(),
    enableSmoothScroll: z.boolean(),
    enableCustomCursor: z.boolean(),
    enableScrollProgress: z.boolean(),
    darkModeDefault: z.boolean(),

    footerCopyrightTemplate: z.string().max(140),

    jsonLd: jsonLdSchema,
  })
  .partial();

export type SiteSettingsInput = z.infer<typeof siteSettingsUpdateSchema>;
