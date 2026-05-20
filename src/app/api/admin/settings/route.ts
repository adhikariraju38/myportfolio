import { SiteSetting } from "@/lib/db/models";
import { siteSettingsUpdateSchema } from "@/lib/validations/site-settings";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(SiteSetting, "settings");
export const PATCH = singletonPatch(SiteSetting, "settings", siteSettingsUpdateSchema, [
  CACHE_TAGS.settings,
  CACHE_TAGS.nav,
]);
