import { certifications } from "@/lib/db/schema";
import { certificationCreateSchema, certificationUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  table: certifications,
  scope: "certifications",
  createSchema: certificationCreateSchema,
  updateSchema: certificationUpdateSchema,
  invalidate: [CACHE_TAGS.certifications] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
