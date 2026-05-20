import { OpenSourceContribution } from "@/lib/db/models";
import { openSourceCreateSchema, openSourceUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: OpenSourceContribution,
  scope: "open-source",
  createSchema: openSourceCreateSchema,
  updateSchema: openSourceUpdateSchema,
  invalidate: [CACHE_TAGS.openSource] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
