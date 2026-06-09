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

    // "Engineered Motion" palette — Iris Violet on cool near-black.
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
    fontSans: "Geist",
    fontDisplay: "Bricolage Grotesque",
    fontMono: "Geist Mono",

    // Switchable accent + typeface set (drives [data-accent] / [data-font]).
    themeAccent: "iris",
    themeFont: "engineered",

    ogTitle: "Raju Kumar Yadav",
    ogSubtitle: "Full Stack Engineer",
    ogChips: ["React", "Next.js", "FastAPI", "AWS", "TypeScript"],
    ogBgGradient: "linear-gradient(135deg, #08090C 0%, #0D0F13 50%, #08090C 100%)",
    ogTextColor: "#F2F3F5",
    ogAccentColor: "#8C7CFF",
    ogImage: {},

    faviconGlyph: "R",
    faviconBgGradient: "linear-gradient(135deg, #8C7CFF, #6E5BFF)",
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
