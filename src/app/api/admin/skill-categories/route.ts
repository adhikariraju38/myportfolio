import { skillCategories } from "@/lib/db/schema";
import { skillCategoryCreateSchema, skillCategoryUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: skillCategories,
  scope: "skill-categories",
  createSchema: skillCategoryCreateSchema,
  updateSchema: skillCategoryUpdateSchema,
  invalidate: [CACHE_TAGS.skillCategories] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
