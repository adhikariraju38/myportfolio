import "server-only";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import {
  errorResponse,
  getClientIp,
  parseBody,
  successResponse,
  logServerError,
} from "@/lib/api-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { inquirySubmitSchema } from "@/lib/validations";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function POST(req: NextRequest): Promise<Response> {
  const ip = getClientIp(req);
  const limit = rateLimit(`inquiry:${ip}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.allowed) {
    return errorResponse("Too many submissions. Try later.", 429, {
      headers: { "Retry-After": String(limit.retryAfterSec) },
    });
  }

  const parsed = await parseBody(req, inquirySubmitSchema);
  if (!parsed.success) return parsed.response;

  try {
    const clean = DOMPurify.sanitize(parsed.data.message, { ALLOWED_TAGS: [] });
    await db.insert(inquiries).values({
      name: parsed.data.name.trim().slice(0, 120),
      email: parsed.data.email.toLowerCase().trim(),
      message: clean,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? "",
      status: "new",
    });
    revalidateTag(CACHE_TAGS.inquiries, "max");
    return successResponse({ ok: true });
  } catch (err) {
    logServerError("public-inquiries", err);
    return errorResponse("Submit failed", 500);
  }
}
