// Big content seed — reads from src/lib/data.ts via direct import so we stay in sync
// until Phase 10 deletes that file.
import mongoose from "mongoose";

import {
  HERO,
  ABOUT,
  EXPERIENCES,
  SKILLS,
  SKILL_CATEGORIES,
  PROJECTS,
  AWARDS,
  CERTIFICATIONS,
  EDUCATION,
  COMMUNITY,
  PUBLICATIONS,
  OPEN_SOURCE_CONTRIBUTIONS,
} from "../src/lib/data";

const now = () => new Date();

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri, { dbName: "myportfolio" });
  const db = mongoose.connection;

  // Hero singleton
  await db.collection("herocontents").updateOne(
    { key: "default" },
    {
      $set: {
        key: "default",
        eyebrowText: "Hi, I'm",
        name: HERO.name,
        title: HERO.title,
        tagline: HERO.tagline,
        primaryCta: { label: HERO.cta.primary.label, href: HERO.cta.primary.href },
        secondaryCta: { label: HERO.cta.secondary.label, href: HERO.cta.secondary.href },
        enable3dCanvas: true,
        updatedAt: now(),
      },
      $setOnInsert: { createdAt: now() },
    },
    { upsert: true },
  );

  // About singleton
  await db.collection("aboutcontents").updateOne(
    { key: "default" },
    {
      $set: {
        key: "default",
        heading: "About Me",
        summary: ABOUT.summary,
        profileImage: { url: "/images/raju-profile.jpg" },
        profileAlt: HERO.name,
        stats: ABOUT.stats.map((s, i) => ({
          label: s.label,
          value: s.value,
          suffix: s.suffix ?? "",
          orderIndex: i,
        })),
        updatedAt: now(),
      },
      $setOnInsert: { createdAt: now() },
    },
    { upsert: true },
  );

  // Education singleton
  await db.collection("educations").updateOne(
    { key: "default" },
    {
      $set: {
        key: "default",
        school: EDUCATION.school,
        degree: EDUCATION.degree,
        grade: EDUCATION.grade,
        period: EDUCATION.period,
        location: EDUCATION.location,
        updatedAt: now(),
      },
      $setOnInsert: { createdAt: now() },
    },
    { upsert: true },
  );

  // Experiences — clear and re-insert to keep order
  await db.collection("experiences").deleteMany({});
  await db.collection("experiences").insertMany(
    EXPERIENCES.map((e, i) => ({
      company: e.company,
      role: e.role,
      location: e.location,
      period: e.period,
      type: e.type,
      bullets: e.bullets,
      tech: e.tech,
      orderIndex: i,
      isVisible: true,
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  // Skill categories
  await db.collection("skillcategories").deleteMany({});
  const catDocs = SKILL_CATEGORIES.map((name, i) => ({
    name,
    slug: slugify(name),
    orderIndex: i,
    createdAt: now(),
    updatedAt: now(),
  }));
  const catRes = await db.collection("skillcategories").insertMany(catDocs);
  const catBySlug = new Map<string, mongoose.Types.ObjectId>();
  catDocs.forEach((d, i) => {
    catBySlug.set(d.slug, catRes.insertedIds[i] as mongoose.Types.ObjectId);
  });

  // Skills
  await db.collection("skills").deleteMany({});
  const skillDocs = SKILLS.map((s, i) => {
    const catId = catBySlug.get(slugify(s.category));
    if (!catId) throw new Error(`Unknown skill category: ${s.category}`);
    return {
      name: s.name,
      categoryId: catId,
      production: !!s.production,
      orderIndex: i,
      createdAt: now(),
      updatedAt: now(),
    };
  });
  await db.collection("skills").insertMany(skillDocs);

  // Projects
  await db.collection("projects").deleteMany({});
  await db.collection("projects").insertMany(
    PROJECTS.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      tech: p.tech,
      metric: p.metric,
      link: p.link ?? "",
      github: p.github ?? "",
      coverImage: {},
      orderIndex: i,
      isPublished: true,
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  // Publications
  await db.collection("publications").deleteMany({});
  await db.collection("publications").insertMany(
    PUBLICATIONS.map((p, i) => ({
      title: p.title,
      authors: p.authors,
      venue: p.venue,
      year: p.year,
      doi: p.doi ?? "",
      description: p.description,
      orderIndex: i,
      isVisible: true,
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  // Open source
  await db.collection("opensourcecontributions").deleteMany({});
  await db.collection("opensourcecontributions").insertMany(
    OPEN_SOURCE_CONTRIBUTIONS.map((c, i) => ({
      project: c.project,
      organization: c.organization,
      description: c.description,
      repoUrl: c.repoUrl,
      orderIndex: i,
      isVisible: true,
      contributions: c.contributions.map((it) => ({
        refId: it.id,
        title: it.title,
        severity: it.severity,
        description: it.description,
        url: it.url,
      })),
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  // Awards
  await db.collection("awards").deleteMany({});
  await db.collection("awards").insertMany(
    AWARDS.map((a, i) => ({
      title: a.title,
      event: a.event,
      rank: a.rank,
      orderIndex: i,
      isVisible: true,
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  // Certifications
  await db.collection("certifications").deleteMany({});
  await db.collection("certifications").insertMany(
    CERTIFICATIONS.map((c, i) => ({
      title: c.title,
      issuer: c.issuer,
      link: c.link,
      orderIndex: i,
      isVisible: true,
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  // Community involvement
  await db.collection("communityinvolvements").deleteMany({});
  await db.collection("communityinvolvements").insertMany(
    COMMUNITY.map((c, i) => ({
      role: c.role,
      org: c.org,
      year: c.year,
      description: c.description,
      orderIndex: i,
      isVisible: true,
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  console.log("content seed → done");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
