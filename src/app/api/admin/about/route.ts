import { aboutContent } from "@/lib/db/schema";
import { aboutUpdateSchema } from "@/lib/validations";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(aboutContent, "about");
export const PATCH = singletonPatch(aboutContent, "about", aboutUpdateSchema, [CACHE_TAGS.about]);
