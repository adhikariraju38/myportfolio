import { Award } from "@/lib/db/models";
import { awardCreateSchema, awardUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Award,
  scope: "awards",
  createSchema: awardCreateSchema,
  updateSchema: awardUpdateSchema,
  invalidate: [CACHE_TAGS.awards] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
