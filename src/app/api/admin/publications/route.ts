import { Publication } from "@/lib/db/models";
import { publicationCreateSchema, publicationUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Publication,
  scope: "publications",
  createSchema: publicationCreateSchema,
  updateSchema: publicationUpdateSchema,
  defaultSort: { year: -1 as const, orderIndex: 1 as const },
  invalidate: [CACHE_TAGS.publications] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
