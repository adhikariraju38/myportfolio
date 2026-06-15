import "server-only";
import { desc, eq } from "drizzle-orm";
import {
  errorResponse,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { serialize } from "@/lib/db/serialize";

type InquiryStatus = (typeof inquiries.status.enumValues)[number];

export const GET = withAdminAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") as InquiryStatus | null;
    const rows = status
      ? await db
          .select()
          .from(inquiries)
          .where(eq(inquiries.status, status))
          .orderBy(desc(inquiries.createdAt))
          .limit(200)
      : await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200);
    return successResponse(serialize(rows as Record<string, unknown>[]));
  } catch (err) {
    logServerError("inquiries.list", err);
    return errorResponse("Failed to load", 500);
  }
});
