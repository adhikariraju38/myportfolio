import { HeroContent } from "@/lib/db/models";
import { heroUpdateSchema } from "@/lib/validations";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(HeroContent, "hero");
export const PATCH = singletonPatch(HeroContent, "hero", heroUpdateSchema, [CACHE_TAGS.hero]);
