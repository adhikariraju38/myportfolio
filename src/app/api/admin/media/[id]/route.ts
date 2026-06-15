import {
  errorResponse,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { deleteFile } from "@/lib/db/media";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const isValidId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const DELETE = withAdminAuth(async (_req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  try {
    await deleteFile(id);
    revalidateTag(CACHE_TAGS.media, "max");
    return successResponse({ ok: true });
  } catch (err) {
    logServerError("media.delete", err);
    return errorResponse("Delete failed", 500);
  }
});
