import { Skill } from "@/lib/db/models";
import { skillCreateSchema, skillUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Skill,
  scope: "skills",
  createSchema: skillCreateSchema,
  updateSchema: skillUpdateSchema,
  invalidate: [CACHE_TAGS.skills] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
