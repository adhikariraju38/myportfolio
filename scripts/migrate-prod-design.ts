/**
 * One-off: apply the "Engineered Motion" design to an existing
 * site_settings doc WITHOUT touching content. Updates only visual/design
 * fields; preserves tagline, socials, contact, OG text/chips, brand,
 * keywords, JSON-LD, and every other content collection.
 *
 * Run against production:
 *   tsx --env-file=.env.production.local scripts/migrate-prod-design.ts
 */
import mongoose from "mongoose";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri, { dbName: "myportfolio" });
  const col = mongoose.connection.collection("sitesettings");

  // DESIGN-ONLY fields. No content fields here.
  const design = {
    themeDark: {
      background: "#08090C",
      backgroundSecondary: "#0D0F13",
      backgroundTertiary: "#14161C",
      foreground: "#F2F3F5",
      foregroundSecondary: "#8B919E",
      foregroundTertiary: "#5E6470",
      accentBlue: "#8C7CFF",
      accentAmber: "#FFB020",
      accentEmerald: "#3FD68C",
      border: "#20242D",
      themeColor: "#08090c",
    },
    themeLight: {
      background: "#F6F7F3",
      backgroundSecondary: "#FFFFFF",
      backgroundTertiary: "#F1F3EC",
      foreground: "#0E1014",
      foregroundSecondary: "#51565F",
      foregroundTertiary: "#898E97",
      accentBlue: "#8C7CFF",
      accentAmber: "#D97706",
      accentEmerald: "#059669",
      border: "#E2E5DB",
      themeColor: "#f6f7f3",
    },
    themeAccent: "iris",
    themeFont: "engineered",
    fontSans: "Geist",
    fontDisplay: "Bricolage Grotesque",
    fontMono: "Geist Mono",
    // OG/favicon COLORS only (not the OG title/subtitle/chips text).
    ogBgGradient: "linear-gradient(135deg, #08090C 0%, #0D0F13 50%, #08090C 100%)",
    ogTextColor: "#F2F3F5",
    ogAccentColor: "#8C7CFF",
    faviconBgGradient: "linear-gradient(135deg, #8C7CFF, #6E5BFF)",
    faviconTextColor: "#FFFFFF",
    heroParticleDensity: 100,
    contactMeshDensity: 100,
    updatedAt: new Date(),
  };

  const res = await col.updateOne({ key: "default" }, { $set: design });
  console.log(
    `prod design migrate → matched=${res.matchedCount} modified=${res.modifiedCount}` +
      (res.matchedCount === 0
        ? " (no settings doc — app will use the new model defaults)"
        : ""),
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
