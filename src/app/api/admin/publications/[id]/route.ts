import { publications } from "@/lib/db/schema";
import { publicationCreateSchema, publicationUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: publications,
  scope: "publications",
  createSchema: publicationCreateSchema,
  updateSchema: publicationUpdateSchema,
  invalidate: [CACHE_TAGS.publications] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
