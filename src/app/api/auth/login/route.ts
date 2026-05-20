import "server-only";
import type { NextRequest } from "next/server";
import {
  errorResponse,
  getClientIp,
  parseBody,
  successResponse,
  logServerError,
} from "@/lib/api-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { getDb } from "@/lib/db";
import { User } from "@/lib/db/models";
import {
  constantTimeVerifyPassword,
  createSession,
  setSessionCookie,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest): Promise<Response> {
  const ip = getClientIp(req);
  const limit = rateLimit(`login:${ip}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
    blockMs: 15 * 60 * 1000,
  });
  if (!limit.allowed) {
    return errorResponse("Too many attempts. Try later.", 429, {
      headers: { "Retry-After": String(limit.retryAfterSec) },
    });
  }

  const parsed = await parseBody(req, loginSchema);
  if (!parsed.success) return parsed.response;

  try {
    await getDb();
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
    const ok = await constantTimeVerifyPassword(
      parsed.data.password,
      user?.passwordHash ?? null,
    );

    if (!user || !ok) return errorResponse("Invalid email or password", 401);
    if (!user.isActive) return errorResponse("Account disabled", 403);

    const session = await createSession(user._id.toString(), {
      userAgent: req.headers.get("user-agent"),
      ipAddress: ip,
    });
    await setSessionCookie(session.token, session.expiresAt);

    user.lastLoginAt = new Date();
    await user.save();

    return successResponse({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    logServerError("login", err);
    return errorResponse("Login failed", 500);
  }
}
