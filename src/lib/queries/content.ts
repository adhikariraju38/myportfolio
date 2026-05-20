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

const cached = <T>(
  fn: () => Promise<T>,
  key: string,
  tag: string,
): (() => Promise<T>) =>
  unstable_cache(fn, [key], { tags: [tag, CACHE_TAGS.all] });

export const getHero = cached(
  async () => {
    await getDb();
    const doc = await HeroContent.findOne({ key: "default" }).lean();
    return doc ? (serialize(doc as Row) as Row) : null;
  },
  "hero",
  CACHE_TAGS.hero,
);

export const getAbout = cached(
  async () => {
    await getDb();
    const doc = await AboutContent.findOne({ key: "default" }).lean();
    return doc ? (serialize(doc as Row) as Row) : null;
  },
  "about",
  CACHE_TAGS.about,
);

export const getEducation = cached(
  async () => {
    await getDb();
    const doc = await Education.findOne({ key: "default" }).lean();
    return doc ? (serialize(doc as Row) as Row) : null;
  },
  "education",
  CACHE_TAGS.education,
);

export const getExperiences = cached(
  async () => {
    await getDb();
    const docs = await Experience.find({ isVisible: true })
      .sort({ orderIndex: 1, createdAt: 1 })
      .lean();
    return serialize(docs as Row[]) as Row[];
  },
  "experiences",
  CACHE_TAGS.experiences,
);

export const getSkills = cached(
  async () => {
    await getDb();
    const [cats, skills] = await Promise.all([
      SkillCategory.find({}).sort({ orderIndex: 1 }).lean(),
      Skill.find({}).sort({ categoryId: 1, orderIndex: 1 }).lean(),
    ]);
    return {
      categories: serialize(cats as Row[]) as Row[],
      skills: serialize(skills as Row[]) as Row[],
    };
  },
  "skills",
  CACHE_TAGS.skills,
);

export const getProjects = cached(
  async () => {
    await getDb();
    const docs = await Project.find({ isPublished: true })
      .sort({ orderIndex: 1, createdAt: 1 })
      .lean();
    return serialize(docs as Row[]) as Row[];
  },
  "projects",
  CACHE_TAGS.projects,
);

export const getPublications = cached(
  async () => {
    await getDb();
    const docs = await Publication.find({ isVisible: true })
      .sort({ year: -1, orderIndex: 1 })
      .lean();
    return serialize(docs as Row[]) as Row[];
  },
  "publications",
  CACHE_TAGS.publications,
);

export const getOpenSource = cached(
  async () => {
    await getDb();
    const docs = await OpenSourceContribution.find({ isVisible: true })
      .sort({ orderIndex: 1, createdAt: 1 })
      .lean();
    return serialize(docs as Row[]) as Row[];
  },
  "open-source",
  CACHE_TAGS.openSource,
);

export const getAwards = cached(
  async () => {
    await getDb();
    const [awards, certifications] = await Promise.all([
      Award.find({ isVisible: true }).sort({ orderIndex: 1 }).lean(),
      Certification.find({ isVisible: true }).sort({ orderIndex: 1 }).lean(),
    ]);
    return {
      awards: serialize(awards as Row[]) as Row[],
      certifications: serialize(certifications as Row[]) as Row[],
    };
  },
  "awards",
  CACHE_TAGS.awards,
);

export const getCommunityInvolvement = cached(
  async () => {
    await getDb();
    const docs = await CommunityInvolvement.find({ isVisible: true })
      .sort({ orderIndex: 1 })
      .lean();
    return serialize(docs as Row[]) as Row[];
  },
  "community",
  CACHE_TAGS.community,
);
