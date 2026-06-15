import { experiences } from "@/lib/db/schema";
import { experienceCreateSchema, experienceUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: experiences,
  scope: "experience",
  createSchema: experienceCreateSchema,
  updateSchema: experienceUpdateSchema,
  invalidate: [CACHE_TAGS.experiences] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
