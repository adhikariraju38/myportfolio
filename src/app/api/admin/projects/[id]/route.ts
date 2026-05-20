import { Project } from "@/lib/db/models";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Project,
  scope: "projects",
  createSchema: projectCreateSchema,
  updateSchema: projectUpdateSchema,
  invalidate: [CACHE_TAGS.projects] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
