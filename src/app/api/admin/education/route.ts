import { education } from "@/lib/db/schema";
import { educationUpdateSchema } from "@/lib/validations";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(education, "education");
export const PATCH = singletonPatch(education, "education", educationUpdateSchema, [CACHE_TAGS.education]);
