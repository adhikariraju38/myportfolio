import mongoose from "mongoose";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri, { dbName: "myportfolio" });

  const col = mongoose.connection.collection("sitesettings");
  const now = new Date();

  const defaultDoc = {
    key: "default",

    siteTitle: "Raju Kumar Yadav | Full Stack Engineer",
    siteTitleTemplate: "%s | Raju Kumar Yadav",
    siteDescription:
      "Full Stack Engineer with 3.5+ years of experience building production-grade microservices platforms, React/Next.js frontends, and cloud infrastructure with AWS + Terraform.",
    brandShort: "RKY",
    brandFull: "Raju Kumar Yadav",
    tagline:
      "3.5+ years building microservices, React frontends, and cloud infrastructure.",
    logoImage: {},

    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    keywords: [
      "Full Stack Engineer",
      "Software Engineer",
      "React Developer",
      "Next.js",
      "FastAPI",
      "Python",
      "TypeScript",
      "Portfolio",
      "Nepal",
    ],
    twitterHandle: "",

    contactEmail: "itsmeerajuyadav@gmail.com",
    contactPhone: "+9779813977980",
    contactLocation: "Tikathali, Lalitpur, Nepal",

    socials: [
      { platform: "github", url: "https://github.com/adhikariraju38", label: "GitHub", icon: "github" },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/adhikariraju38",
        label: "LinkedIn",
        icon: "linkedin",
      },
      { platform: "email", url: "mailto:itsmeerajuyadav@gmail.com", label: "Email", icon: "mail" },
    ],

    themeDark: {
      background: "#0A0A0F",
      backgroundSecondary: "#111118",
      backgroundTertiary: "#1A1A24",
      foreground: "#F0F0F5",
      foregroundSecondary: "#A0A0B8",
      foregroundTertiary: "#606078",
      accentBlue: "#3B82F6",
      accentAmber: "#F59E0B",
      accentEmerald: "#10B981",
      border: "#1E1E2A",
      themeColor: "#0a0a0f",
    },
    themeLight: {
      background: "#FAFAFA",
      backgroundSecondary: "#FFFFFF",
      backgroundTertiary: "#F0F0F0",
      foreground: "#111111",
      foregroundSecondary: "#555555",
      foregroundTertiary: "#888888",
      accentBlue: "#2563EB",
      accentAmber: "#D97706",
      accentEmerald: "#059669",
      border: "#E5E5E5",
      themeColor: "#f8f8fa",
    },
    fontSans: "Inter",
    fontDisplay: "Space Grotesk",
    fontMono: "JetBrains Mono",

    ogTitle: "Raju Kumar Yadav",
    ogSubtitle: "Full Stack Engineer",
    ogChips: ["React", "Next.js", "FastAPI", "AWS", "TypeScript"],
    ogBgGradient: "linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #0A0A0F 100%)",
    ogTextColor: "#F0F0F5",
    ogAccentColor: "#3B82F6",
    ogImage: {},

    faviconGlyph: "R",
    faviconBgGradient: "linear-gradient(135deg, #3B82F6, #6366F1)",
    faviconTextColor: "#FFFFFF",
    faviconImage: {},

    enable3dHero: true,
    enable3dContact: true,
    enableSmoothScroll: true,
    enableCustomCursor: true,
    enableScrollProgress: true,
    darkModeDefault: true,

    footerCopyrightTemplate: "© {year} {name}",

    jsonLd: {
      name: "Raju Kumar Yadav",
      jobTitle: "Full Stack Engineer",
      url: "https://rajukumaryadav.com",
      email: "itsmeerajuyadav@gmail.com",
      sameAs: [
        "https://linkedin.com/in/adhikariraju38",
        "https://github.com/adhikariraju38",
      ],
      knowsAbout: [
        "React",
        "Next.js",
        "FastAPI",
        "Python",
        "TypeScript",
        "AWS",
        "Microservices",
        "Clean Architecture",
      ],
      alumniOfName: "IOE Pulchowk Campus",
      addressLocality: "Lalitpur",
      addressCountry: "Nepal",
    },

    updatedAt: now,
  };

  const res = await col.updateOne(
    { key: "default" },
    { $set: defaultDoc, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );
  console.log(`site-settings upsert → matched=${res.matchedCount} upserted=${res.upsertedCount}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
