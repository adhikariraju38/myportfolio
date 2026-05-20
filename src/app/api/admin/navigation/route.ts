import "server-only";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import {
  errorResponse,
  parseBody,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { NavMenuItem } from "@/lib/db/models";
import { serialize } from "@/lib/db/serialize";
import { navMenuItemCreateSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = withAdminAuth(async (req: NextRequest) => {
  const url = new URL(req.url);
  const location = url.searchParams.get("location") as "header" | "footer" | null;
  try {
    await getDb();
    const filter = location ? { location } : {};
    const docs = await NavMenuItem.find(filter).sort({ orderIndex: 1 }).lean();
    return successResponse(serialize(docs as Record<string, unknown>[]));
  } catch (err) {
    logServerError("nav.list", err);
    return errorResponse("Failed to load", 500);
  }
});

export const POST = withAdminAuth(async (req) => {
  const parsed = await parseBody(req, navMenuItemCreateSchema);
  if (!parsed.success) return parsed.response;
  try {
    await getDb();
    const doc = await NavMenuItem.create(parsed.data);
    revalidateTag(CACHE_TAGS.nav, "max");
    revalidateTag(CACHE_TAGS.all, "max");
    return successResponse(serialize(doc.toObject() as Record<string, unknown>), 201);
  } catch (err) {
    logServerError("nav.create", err);
    return errorResponse("Create failed", 400);
  }
});
