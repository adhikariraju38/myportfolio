import "server-only";
import { revalidateTag } from "next/cache";
import { errorResponse, parseBody, successResponse, withAdminAuth, logServerError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { HomeSection } from "@/lib/db/models";
import { serialize } from "@/lib/db/serialize";
import { homeSectionsBulkSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = withAdminAuth(async () => {
  try {
    await getDb();
    const docs = await HomeSection.find({}).sort({ orderIndex: 1 }).lean();
    return successResponse(serialize(docs as Record<string, unknown>[]));
  } catch (err) {
    logServerError("sections.list", err);
    return errorResponse("Failed to load", 500);
  }
});

export const PATCH = withAdminAuth(async (req) => {
  const parsed = await parseBody(req, homeSectionsBulkSchema);
  if (!parsed.success) return parsed.response;
  try {
    await getDb();
    const ops = parsed.data.items.map((it) => ({
      updateOne: {
        filter: { key: it.key },
        update: { $set: { isVisible: it.isVisible, orderIndex: it.orderIndex } },
      },
    }));
    await HomeSection.bulkWrite(ops);
    revalidateTag(CACHE_TAGS.sections, "max");
    revalidateTag(CACHE_TAGS.all, "max");
    return successResponse({ updated: parsed.data.items.length });
  } catch (err) {
    logServerError("sections.update", err);
    return errorResponse("Update failed", 500);
  }
});
