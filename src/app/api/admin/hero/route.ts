import { heroContent } from "@/lib/db/schema";
import { heroUpdateSchema } from "@/lib/validations";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(heroContent, "hero");
export const PATCH = singletonPatch(heroContent, "hero", heroUpdateSchema, [CACHE_TAGS.hero]);
