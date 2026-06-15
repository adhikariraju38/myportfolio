import { communityInvolvements } from "@/lib/db/schema";
import { communityCreateSchema, communityUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: communityInvolvements,
  scope: "community",
  createSchema: communityCreateSchema,
  updateSchema: communityUpdateSchema,
  invalidate: [CACHE_TAGS.community] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
