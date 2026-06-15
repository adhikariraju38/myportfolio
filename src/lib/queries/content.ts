import "server-only";
import { unstable_cache } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  heroContent,
  aboutContent,
  education,
  experiences,
  skillCategories,
  skills,
  projects,
  publications,
  openSourceContributions,
  awards,
  certifications,
  communityInvolvements,
} from "@/lib/db/schema";
import { serialize } from "@/lib/db/serialize";
import { CACHE_TAGS } from "@/lib/cache-tags";

type Row = Record<string, unknown>;

function logDbError(scope: string, err: unknown) {
  if (err instanceof Error) {
    console.warn(`[queries.${scope}] DB read failed: ${err.message}`);
  } else {
    console.warn(`[queries.${scope}] DB read failed`);
  }
}

async function safeOne<T>(fn: () => Promise<T | null>, scope: string): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    logDbError(scope, err);
    return null;
  }
}
async function safeMany<T>(fn: () => Promise<T[]>, scope: string): Promise<T[]> {
  try {
    return await fn();
  } catch (err) {
    logDbError(scope, err);
    return [];
  }
}

// `pg` keypart busts the Mongo-era cache entries once on deploy; `revalidate`
// lets content self-heal if the DB is changed outside the admin flow.
const cached = <T>(fn: () => Promise<T>, key: string, tag: string): (() => Promise<T>) =>
  unstable_cache(fn, [key, "pg"], { tags: [tag, CACHE_TAGS.all], revalidate: 300 });

export const getHero = cached(
  () =>
    safeOne(async () => {
      const [row] = await db
        .select()
        .from(heroContent)
        .where(eq(heroContent.key, "default"))
        .limit(1);
      return row ? (serialize(row as Row) as Row) : null;
    }, "hero"),
  "hero",
  CACHE_TAGS.hero,
);

export const getAbout = cached(
  () =>
    safeOne(async () => {
      const [row] = await db
        .select()
        .from(aboutContent)
        .where(eq(aboutContent.key, "default"))
        .limit(1);
      return row ? (serialize(row as Row) as Row) : null;
    }, "about"),
  "about",
  CACHE_TAGS.about,
);

export const getEducation = cached(
  () =>
    safeOne(async () => {
      const [row] = await db
        .select()
        .from(education)
        .where(eq(education.key, "default"))
        .limit(1);
      return row ? (serialize(row as Row) as Row) : null;
    }, "education"),
  "education",
  CACHE_TAGS.education,
);

export const getExperiences = cached(
  () =>
    safeMany<Row>(async () => {
      const rows = await db
        .select()
        .from(experiences)
        .where(eq(experiences.isVisible, true))
        .orderBy(asc(experiences.orderIndex), asc(experiences.createdAt));
      return serialize(rows as Row[]) as Row[];
    }, "experiences"),
  "experiences",
  CACHE_TAGS.experiences,
);

export const getSkills = cached(
  async () => {
    try {
      const [cats, skillRows] = await Promise.all([
        db.select().from(skillCategories).orderBy(asc(skillCategories.orderIndex)),
        db.select().from(skills).orderBy(asc(skills.categoryId), asc(skills.orderIndex)),
      ]);
      return {
        categories: serialize(cats as Row[]) as Row[],
        skills: serialize(skillRows as Row[]) as Row[],
      };
    } catch (err) {
      logDbError("skills", err);
      return { categories: [] as Row[], skills: [] as Row[] };
    }
  },
  "skills",
  CACHE_TAGS.skills,
);

export const getProjects = cached(
  () =>
    safeMany<Row>(async () => {
      const rows = await db
        .select()
        .from(projects)
        .where(eq(projects.isPublished, true))
        .orderBy(asc(projects.orderIndex), asc(projects.createdAt));
      return serialize(rows as Row[]) as Row[];
    }, "projects"),
  "projects",
  CACHE_TAGS.projects,
);

export const getPublications = cached(
  () =>
    safeMany<Row>(async () => {
      const rows = await db
        .select()
        .from(publications)
        .where(eq(publications.isVisible, true))
        .orderBy(desc(publications.year), asc(publications.orderIndex));
      return serialize(rows as Row[]) as Row[];
    }, "publications"),
  "publications",
  CACHE_TAGS.publications,
);

export const getOpenSource = cached(
  () =>
    safeMany<Row>(async () => {
      const rows = await db
        .select()
        .from(openSourceContributions)
        .where(eq(openSourceContributions.isVisible, true))
        .orderBy(asc(openSourceContributions.orderIndex), asc(openSourceContributions.createdAt));
      return serialize(rows as Row[]) as Row[];
    }, "open-source"),
  "open-source",
  CACHE_TAGS.openSource,
);

export const getAwards = cached(
  async () => {
    try {
      const [awardRows, certRows] = await Promise.all([
        db
          .select()
          .from(awards)
          .where(eq(awards.isVisible, true))
          .orderBy(asc(awards.orderIndex)),
        db
          .select()
          .from(certifications)
          .where(eq(certifications.isVisible, true))
          .orderBy(asc(certifications.orderIndex)),
      ]);
      return {
        awards: serialize(awardRows as Row[]) as Row[],
        certifications: serialize(certRows as Row[]) as Row[],
      };
    } catch (err) {
      logDbError("awards", err);
      return { awards: [] as Row[], certifications: [] as Row[] };
    }
  },
  "awards",
  CACHE_TAGS.awards,
);

export const getCommunityInvolvement = cached(
  () =>
    safeMany<Row>(async () => {
      const rows = await db
        .select()
        .from(communityInvolvements)
        .where(eq(communityInvolvements.isVisible, true))
        .orderBy(asc(communityInvolvements.orderIndex));
      return serialize(rows as Row[]) as Row[];
    }, "community"),
  "community",
  CACHE_TAGS.community,
);
