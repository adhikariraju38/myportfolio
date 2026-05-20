import { AboutContent } from "@/lib/db/models";
import { aboutUpdateSchema } from "@/lib/validations";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(AboutContent, "about");
export const PATCH = singletonPatch(AboutContent, "about", aboutUpdateSchema, [CACHE_TAGS.about]);
