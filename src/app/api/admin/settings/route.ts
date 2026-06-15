import { siteSettings } from "@/lib/db/schema";
import { siteSettingsUpdateSchema } from "@/lib/validations/site-settings";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(siteSettings, "settings");
export const PATCH = singletonPatch(siteSettings, "settings", siteSettingsUpdateSchema, [
  CACHE_TAGS.settings,
  CACHE_TAGS.nav,
]);
