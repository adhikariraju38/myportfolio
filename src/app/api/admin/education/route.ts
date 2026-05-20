import { Education } from "@/lib/db/models";
import { educationUpdateSchema } from "@/lib/validations";
import { singletonGet, singletonPatch } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = singletonGet(Education, "education");
export const PATCH = singletonPatch(Education, "education", educationUpdateSchema, [
  CACHE_TAGS.education,
]);
