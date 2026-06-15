import "server-only";
import { unstable_cache } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteSettings, homeSections, navMenuItems } from "@/lib/db/schema";
import { serialize } from "@/lib/db/serialize";
import { CACHE_TAGS } from "@/lib/cache-tags";

export type SerializedSiteSettings = Record<string, unknown>;
export type SerializedHomeSection = Record<string, unknown>;
export type SerializedNavItem = Record<string, unknown>;

function logDbError(scope: string, err: unknown) {
  if (err instanceof Error) {
    console.warn(`[queries.${scope}] DB read failed: ${err.message}`);
  } else {
    console.warn(`[queries.${scope}] DB read failed`);
  }
}

export const getSiteSettings = unstable_cache(
  async (): Promise<SerializedSiteSettings | null> => {
    try {
      const [row] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, "default"))
        .limit(1);
      if (!row) return null;
      return serialize(row as Record<string, unknown>);
    } catch (err) {
      logDbError("site-settings", err);
      return null;
    }
  },
  ["site-settings"],
  { tags: [CACHE_TAGS.settings, CACHE_TAGS.all] },
);

export const getHomeSections = unstable_cache(
  async (): Promise<SerializedHomeSection[]> => {
    try {
      const rows = await db
        .select()
        .from(homeSections)
        .orderBy(asc(homeSections.orderIndex), asc(homeSections.createdAt));
      return serialize(rows as Record<string, unknown>[]);
    } catch (err) {
      logDbError("home-sections", err);
      return [];
    }
  },
  ["home-sections"],
  { tags: [CACHE_TAGS.sections, CACHE_TAGS.all] },
);

export const getNavItems = unstable_cache(
  async (location: "header" | "footer"): Promise<SerializedNavItem[]> => {
    try {
      const rows = await db
        .select()
        .from(navMenuItems)
        .where(and(eq(navMenuItems.location, location), eq(navMenuItems.isActive, true)))
        .orderBy(asc(navMenuItems.orderIndex), asc(navMenuItems.createdAt));
      return serialize(rows as Record<string, unknown>[]);
    } catch (err) {
      logDbError("nav-items", err);
      return [];
    }
  },
  ["nav-items"],
  { tags: [CACHE_TAGS.nav, CACHE_TAGS.all] },
);
