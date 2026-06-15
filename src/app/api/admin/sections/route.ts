import "server-only";
import { revalidateTag } from "next/cache";
import { asc, eq } from "drizzle-orm";
import {
  errorResponse,
  parseBody,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { homeSections, type SectionKey } from "@/lib/db/schema";
import { serialize } from "@/lib/db/serialize";
import { homeSectionsBulkSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = withAdminAuth(async () => {
  try {
    const rows = await db.select().from(homeSections).orderBy(asc(homeSections.orderIndex));
    return successResponse(serialize(rows as Record<string, unknown>[]));
  } catch (err) {
    logServerError("sections.list", err);
    return errorResponse("Failed to load", 500);
  }
});

export const PATCH = withAdminAuth(async (req) => {
  const parsed = await parseBody(req, homeSectionsBulkSchema);
  if (!parsed.success) return parsed.response;
  try {
    await db.transaction(async (tx) => {
      for (const it of parsed.data.items) {
        await tx
          .update(homeSections)
          .set({ isVisible: it.isVisible, orderIndex: it.orderIndex, updatedAt: new Date() })
          .where(eq(homeSections.key, it.key as SectionKey));
      }
    });
    revalidateTag(CACHE_TAGS.sections, "max");
    revalidateTag(CACHE_TAGS.all, "max");
    return successResponse({ updated: parsed.data.items.length });
  } catch (err) {
    logServerError("sections.update", err);
    return errorResponse("Update failed", 500);
  }
});
