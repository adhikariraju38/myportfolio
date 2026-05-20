import { NavMenuItem } from "@/lib/db/models";
import { navMenuItemCreateSchema, navMenuItemUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: NavMenuItem,
  scope: "navigation",
  createSchema: navMenuItemCreateSchema,
  updateSchema: navMenuItemUpdateSchema,
  invalidate: [CACHE_TAGS.nav] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
