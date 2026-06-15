import { navMenuItems } from "@/lib/db/schema";
import { navMenuItemCreateSchema, navMenuItemUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: navMenuItems,
  scope: "navigation",
  createSchema: navMenuItemCreateSchema,
  updateSchema: navMenuItemUpdateSchema,
  invalidate: [CACHE_TAGS.nav] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
