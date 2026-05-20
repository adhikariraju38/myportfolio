import "server-only";
import {
  errorResponse,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { Inquiry } from "@/lib/db/models";
import { serialize } from "@/lib/db/serialize";

export const GET = withAdminAuth(async (req) => {
  try {
    await getDb();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const filter = status ? { status } : {};
    const docs = await Inquiry.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    return successResponse(serialize(docs as Record<string, unknown>[]));
  } catch (err) {
    logServerError("inquiries.list", err);
    return errorResponse("Failed to load", 500);
  }
});
