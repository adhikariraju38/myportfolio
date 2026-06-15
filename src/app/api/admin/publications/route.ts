import { publications } from "@/lib/db/schema";
import { publicationCreateSchema, publicationUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: publications,
  scope: "publications",
  createSchema: publicationCreateSchema,
  updateSchema: publicationUpdateSchema,
  invalidate: [CACHE_TAGS.publications] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
