import { Experience } from "@/lib/db/models";
import { experienceCreateSchema, experienceUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Experience,
  scope: "experience",
  createSchema: experienceCreateSchema,
  updateSchema: experienceUpdateSchema,
  invalidate: [CACHE_TAGS.experiences] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
