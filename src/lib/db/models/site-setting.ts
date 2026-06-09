import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaRef = new Schema(
  { url: { type: String }, mediaId: { type: Schema.Types.ObjectId } },
  { _id: false },
);

const themeTokens = new Schema(
  {
    background: { type: String },
    backgroundSecondary: { type: String },
    backgroundTertiary: { type: String },
    foreground: { type: String },
    foregroundSecondary: { type: String },
    foregroundTertiary: { type: String },
    accentBlue: { type: String },
    accentAmber: { type: String },
    accentEmerald: { type: String },
    border: { type: String },
    themeColor: { type: String },
  },
  { _id: false },
);

const socialLink = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    label: { type: String },
    icon: { type: String },
  },
  { _id: false },
);

const jsonLdSchema = new Schema(
  {
    name: { type: String },
    jobTitle: { type: String },
    url: { type: String },
    email: { type: String },
    sameAs: [{ type: String }],
    knowsAbout: [{ type: String }],
    alumniOfName: { type: String },
    addressLocality: { type: String },
    addressCountry: { type: String },
  },
  { _id: false },
);

const siteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },

    // Branding
    siteTitle: { type: String, required: true },
    siteTitleTemplate: { type: String, default: "%s | Portfolio" },
    siteDescription: { type: String, default: "" },
    brandShort: { type: String, default: "RKY" },
    brandFull: { type: String, default: "" },
    tagline: { type: String, default: "" },
    logoImage: { type: mediaRef, default: {} },

    // SEO + base
    siteUrl: { type: String, default: "http://localhost:3000" },
    keywords: [{ type: String }],
    twitterHandle: { type: String, default: "" },

    // Contact (mirrors lib/data.ts CONTACT)
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactLocation: { type: String, default: "" },

    // Socials
    socials: { type: [socialLink], default: [] },

    // Theme tokens
    themeDark: { type: themeTokens, default: {} },
    themeLight: { type: themeTokens, default: {} },
    fontSans: { type: String, default: "Inter" },
    fontDisplay: { type: String, default: "Space Grotesk" },
    fontMono: { type: String, default: "JetBrains Mono" },

    // "Engineered Motion" — switchable accent + typeface set ([data-*])
    themeAccent: {
      type: String,
      enum: ["iris", "lime", "cyan", "coral", "cobalt", "magenta"],
      default: "iris",
    },
    themeFont: {
      type: String,
      enum: ["engineered", "geometric", "grotesk", "expressive"],
      default: "engineered",
    },

    // OG image (dynamic)
    ogTitle: { type: String, default: "" },
    ogSubtitle: { type: String, default: "" },
    ogChips: [{ type: String }],
    ogBgGradient: { type: String, default: "linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #0A0A0F 100%)" },
    ogTextColor: { type: String, default: "#F0F0F5" },
    ogAccentColor: { type: String, default: "#3B82F6" },
    ogImage: { type: mediaRef, default: {} },

    // Favicon (dynamic)
    faviconGlyph: { type: String, default: "R" },
    faviconBgGradient: {
      type: String,
      default: "linear-gradient(135deg, #3B82F6, #6366F1)",
    },
    faviconTextColor: { type: String, default: "#FFFFFF" },
    faviconImage: { type: mediaRef, default: {} },

    // Toggles
    enable3dHero: { type: Boolean, default: true },
    enable3dContact: { type: Boolean, default: true },
    enableSmoothScroll: { type: Boolean, default: true },
    enableCustomCursor: { type: Boolean, default: true },
    enableScrollProgress: { type: Boolean, default: true },
    darkModeDefault: { type: Boolean, default: true },

    // Footer
    footerCopyrightTemplate: {
      type: String,
      default: "© {year} {name}",
    },

    // JSON-LD
    jsonLd: { type: jsonLdSchema, default: {} },
  },
  { timestamps: true },
);

export type SiteSettingDoc = InferSchemaType<typeof siteSettingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSetting: Model<SiteSettingDoc> =
  (mongoose.models.SiteSetting as Model<SiteSettingDoc>) ??
  mongoose.model<SiteSettingDoc>("SiteSetting", siteSettingSchema);
