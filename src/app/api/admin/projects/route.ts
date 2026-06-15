import { projects } from "@/lib/db/schema";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: projects,
  scope: "projects",
  createSchema: projectCreateSchema,
  updateSchema: projectUpdateSchema,
  invalidate: [CACHE_TAGS.projects] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
