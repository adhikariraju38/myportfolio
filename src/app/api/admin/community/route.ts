import { communityInvolvements } from "@/lib/db/schema";
import { communityCreateSchema, communityUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: communityInvolvements,
  scope: "community",
  createSchema: communityCreateSchema,
  updateSchema: communityUpdateSchema,
  invalidate: [CACHE_TAGS.community] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
