import { Certification } from "@/lib/db/models";
import { certificationCreateSchema, certificationUpdateSchema } from "@/lib/validations";
import { crudDelete, crudDetail, crudUpdate } from "@/lib/api-crud";
import { CACHE_TAGS } from "@/lib/cache-tags";

const cfg = {
  model: Certification,
  scope: "certifications",
  createSchema: certificationCreateSchema,
  updateSchema: certificationUpdateSchema,
  invalidate: [CACHE_TAGS.certifications] as const,
};

export const GET = crudDetail(cfg);
export const PATCH = crudUpdate(cfg);
export const DELETE = crudDelete(cfg);
