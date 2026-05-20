import "server-only";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/db";
import {
  HeroContent,
  AboutContent,
  Education,
  Experience,
  SkillCategory,
  Skill,
  Project,
  Publication,
  OpenSourceContribution,
  Award,
  Certification,
  CommunityInvolvement,
} from "@/lib/db/models";
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

const cached = <T>(
  fn: () => Promise<T>,
  key: string,
  tag: string,
): (() => Promise<T>) =>
  unstable_cache(fn, [key], { tags: [tag, CACHE_TAGS.all] });

export const getHero = cached(
  () =>
    safeOne(async () => {
      await getDb();
      const doc = await HeroContent.findOne({ key: "default" }).lean();
      return doc ? (serialize(doc as Row) as Row) : null;
    }, "hero"),
  "hero",
  CACHE_TAGS.hero,
);

export const getAbout = cached(
  () =>
    safeOne(async () => {
      await getDb();
      const doc = await AboutContent.findOne({ key: "default" }).lean();
      return doc ? (serialize(doc as Row) as Row) : null;
    }, "about"),
  "about",
  CACHE_TAGS.about,
);

export const getEducation = cached(
  () =>
    safeOne(async () => {
      await getDb();
      const doc = await Education.findOne({ key: "default" }).lean();
      return doc ? (serialize(doc as Row) as Row) : null;
    }, "education"),
  "education",
  CACHE_TAGS.education,
);

export const getExperiences = cached(
  () =>
    safeMany<Row>(async () => {
      await getDb();
      const docs = await Experience.find({ isVisible: true })
        .sort({ orderIndex: 1, createdAt: 1 })
        .lean();
      return serialize(docs as Row[]) as Row[];
    }, "experiences"),
  "experiences",
  CACHE_TAGS.experiences,
);

export const getSkills = cached(
  async () => {
    try {
      await getDb();
      const [cats, skills] = await Promise.all([
        SkillCategory.find({}).sort({ orderIndex: 1 }).lean(),
        Skill.find({}).sort({ categoryId: 1, orderIndex: 1 }).lean(),
      ]);
      return {
        categories: serialize(cats as Row[]) as Row[],
        skills: serialize(skills as Row[]) as Row[],
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
      await getDb();
      const docs = await Project.find({ isPublished: true })
        .sort({ orderIndex: 1, createdAt: 1 })
        .lean();
      return serialize(docs as Row[]) as Row[];
    }, "projects"),
  "projects",
  CACHE_TAGS.projects,
);

export const getPublications = cached(
  () =>
    safeMany<Row>(async () => {
      await getDb();
      const docs = await Publication.find({ isVisible: true })
        .sort({ year: -1, orderIndex: 1 })
        .lean();
      return serialize(docs as Row[]) as Row[];
    }, "publications"),
  "publications",
  CACHE_TAGS.publications,
);

export const getOpenSource = cached(
  () =>
    safeMany<Row>(async () => {
      await getDb();
      const docs = await OpenSourceContribution.find({ isVisible: true })
        .sort({ orderIndex: 1, createdAt: 1 })
        .lean();
      return serialize(docs as Row[]) as Row[];
    }, "open-source"),
  "open-source",
  CACHE_TAGS.openSource,
);

export const getAwards = cached(
  async () => {
    try {
      await getDb();
      const [awards, certifications] = await Promise.all([
        Award.find({ isVisible: true }).sort({ orderIndex: 1 }).lean(),
        Certification.find({ isVisible: true }).sort({ orderIndex: 1 }).lean(),
      ]);
      return {
        awards: serialize(awards as Row[]) as Row[],
        certifications: serialize(certifications as Row[]) as Row[],
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
      await getDb();
      const docs = await CommunityInvolvement.find({ isVisible: true })
        .sort({ orderIndex: 1 })
        .lean();
      return serialize(docs as Row[]) as Row[];
    }, "community"),
  "community",
  CACHE_TAGS.community,
);
