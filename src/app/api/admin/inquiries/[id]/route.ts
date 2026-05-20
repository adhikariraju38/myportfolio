import "server-only";
import { revalidateTag } from "next/cache";
import {
  errorResponse,
  parseBody,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { Inquiry } from "@/lib/db/models";
import { serialize } from "@/lib/db/serialize";
import { inquiryUpdateSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/cache-tags";

const isValidId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export const GET = withAdminAuth(async (_req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  try {
    await getDb();
    const doc = await Inquiry.findById(id).lean();
    if (!doc) return errorResponse("Not found", 404);
    return successResponse(serialize(doc as Record<string, unknown>));
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
    await getDb();
    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { status: parsed.data.status } },
      { new: true },
    ).lean();
    if (!updated) return errorResponse("Not found", 404);
    revalidateTag(CACHE_TAGS.inquiries, "max");
    return successResponse(serialize(updated as Record<string, unknown>));
  } catch (err) {
    logServerError("inquiries.update", err);
    return errorResponse("Update failed", 400);
  }
});

export const DELETE = withAdminAuth(async (_req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  try {
    await getDb();
    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) return errorResponse("Not found", 404);
    revalidateTag(CACHE_TAGS.inquiries, "max");
    return successResponse({ ok: true });
  } catch (err) {
    logServerError("inquiries.delete", err);
    return errorResponse("Delete failed", 500);
  }
});
