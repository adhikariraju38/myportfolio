import { Skill } from "@/lib/db/models";
import { skillCreateSchema, skillUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Skill,
  scope: "skills",
  createSchema: skillCreateSchema,
  updateSchema: skillUpdateSchema,
  invalidate: [CACHE_TAGS.skills] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
