import { Certification } from "@/lib/db/models";
import { certificationCreateSchema, certificationUpdateSchema } from "@/lib/validations";
import { crudCreate, crudList } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Certification,
  scope: "certifications",
  createSchema: certificationCreateSchema,
  updateSchema: certificationUpdateSchema,
  invalidate: [CACHE_TAGS.certifications] as const,
};

export const GET = crudList(cfg);
export const POST = crudCreate(cfg);
