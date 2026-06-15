import "server-only";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import {
  errorResponse,
  parseBody,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { serialize } from "@/lib/db/serialize";
import { inquiryUpdateSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/cache-tags";

const isValidId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const GET = withAdminAuth(async (_req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  try {
    const [row] = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
    if (!row) return errorResponse("Not found", 404);
    return successResponse(serialize(row as Record<string, unknown>));
  } catch (err) {
    logServerError("inquiries.detail", err);
    return errorResponse("Failed to load", 500);
  }
});

export const PATCH = withAdminAuth(async (req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  const parsed = await parseBody(req, inquiryUpdateSchema);
  if (!parsed.success) return parsed.response;
  try {
    const [row] = await db
      .update(inquiries)
      .set({ status: parsed.data.status })
      .where(eq(inquiries.id, id))
      .returning();
    if (!row) return errorResponse("Not found", 404);
    revalidateTag(CACHE_TAGS.inquiries, "max");
    return successResponse(serialize(row as Record<string, unknown>));
  } catch (err) {
    logServerError("inquiries.update", err);
    return errorResponse("Update failed", 400);
  }
});

export const DELETE = withAdminAuth(async (_req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  try {
    const [row] = await db
      .delete(inquiries)
      .where(eq(inquiries.id, id))
      .returning({ id: inquiries.id });
    if (!row) return errorResponse("Not found", 404);
    revalidateTag(CACHE_TAGS.inquiries, "max");
    return successResponse({ ok: true });
  } catch (err) {
    logServerError("inquiries.delete", err);
    return errorResponse("Delete failed", 500);
  }
});
