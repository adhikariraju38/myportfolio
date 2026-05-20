import "server-only";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/db";
import {
  SiteSetting,
  HomeSection,
  NavMenuItem,
  type SiteSettingDoc,
  type HomeSectionDoc,
  type NavMenuItemDoc,
} from "@/lib/db/models";
import { serialize } from "@/lib/db/serialize";
import { CACHE_TAGS } from "@/lib/cache-tags";

export type SerializedSiteSettings = Record<string, unknown>;
export type SerializedHomeSection = Record<string, unknown>;
export type SerializedNavItem = Record<string, unknown>;

export const getSiteSettings = unstable_cache(
  async (): Promise<SerializedSiteSettings | null> => {
    await getDb();
    const doc = await SiteSetting.findOne({ key: "default" }).lean<SiteSettingDoc>();
    if (!doc) return null;
    return serialize(doc as unknown as Record<string, unknown>);
  },
  ["site-settings"],
  { tags: [CACHE_TAGS.settings, CACHE_TAGS.all] },
);

export const getHomeSections = unstable_cache(
  async (): Promise<SerializedHomeSection[]> => {
    await getDb();
    const docs = await HomeSection.find({})
      .sort({ orderIndex: 1, createdAt: 1 })
      .lean<HomeSectionDoc[]>();
    return serialize(docs as unknown as Record<string, unknown>[]);
  },
  ["home-sections"],
  { tags: [CACHE_TAGS.sections, CACHE_TAGS.all] },
);

export const getNavItems = unstable_cache(
  async (location: "header" | "footer"): Promise<SerializedNavItem[]> => {
    await getDb();
    const docs = await NavMenuItem.find({ location, isActive: true })
      .sort({ orderIndex: 1, createdAt: 1 })
      .lean<NavMenuItemDoc[]>();
    return serialize(docs as unknown as Record<string, unknown>[]);
  },
  ["nav-items"],
  { tags: [CACHE_TAGS.nav, CACHE_TAGS.all] },
);
