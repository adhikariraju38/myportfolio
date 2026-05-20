import { SkillCategory } from "@/lib/db/models";
import { skillCategoryCreateSchema, skillCategoryUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: SkillCategory,
  scope: "skill-categories",
  createSchema: skillCategoryCreateSchema,
  updateSchema: skillCategoryUpdateSchema,
  invalidate: [CACHE_TAGS.skillCategories, CACHE_TAGS.skills] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
