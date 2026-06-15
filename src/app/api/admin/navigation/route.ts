import "server-only";
import type { NextRequest } from "next/server";
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
import { navMenuItems } from "@/lib/db/schema";
import { serialize } from "@/lib/db/serialize";
import { navMenuItemCreateSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const GET = withAdminAuth(async (req: NextRequest) => {
  const url = new URL(req.url);
  const location = url.searchParams.get("location") as "header" | "footer" | null;
  try {
    const rows = location
      ? await db
          .select()
          .from(navMenuItems)
          .where(eq(navMenuItems.location, location))
          .orderBy(asc(navMenuItems.orderIndex))
      : await db.select().from(navMenuItems).orderBy(asc(navMenuItems.orderIndex));
    return successResponse(serialize(rows as Record<string, unknown>[]));
  } catch (err) {
    logServerError("nav.list", err);
    return errorResponse("Failed to load", 500);
  }
});

export const POST = withAdminAuth(async (req) => {
  const parsed = await parseBody(req, navMenuItemCreateSchema);
  if (!parsed.success) return parsed.response;
  try {
    const [row] = await db.insert(navMenuItems).values(parsed.data).returning();
    revalidateTag(CACHE_TAGS.nav, "max");
    revalidateTag(CACHE_TAGS.all, "max");
    return successResponse(serialize(row as Record<string, unknown>), 201);
  } catch (err) {
    logServerError("nav.create", err);
    return errorResponse("Create failed", 400);
  }
});
