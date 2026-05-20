import { OpenSourceContribution } from "@/lib/db/models";
import { openSourceCreateSchema, openSourceUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: OpenSourceContribution,
  scope: "open-source",
  createSchema: openSourceCreateSchema,
  updateSchema: openSourceUpdateSchema,
  invalidate: [CACHE_TAGS.openSource] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
