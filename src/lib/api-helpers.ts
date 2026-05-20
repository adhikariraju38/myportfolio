import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { ZodSchema } from "zod";
import { getCurrentUser, type SafeUser } from "@/lib/auth";

export function successResponse<T>(data: T, status = 200): Response {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400, init?: ResponseInit): Response {
  return NextResponse.json({ success: false, error }, { status, ...init });
}

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getAllowedOrigins(): string[] {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [base.replace(/\/$/, "")];
}

function isSameOrigin(req: NextRequest): boolean {
  if (!MUTATION_METHODS.has(req.method)) return true;
  const origin = req.headers.get("origin");
  if (!origin) {
    const host = req.headers.get("host");
    const referer = req.headers.get("referer");
    if (!host || !referer) return false;
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return getAllowedOrigins().includes(origin.replace(/\/$/, ""));
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

type RouteContext = { params?: Promise<Record<string, string>> };

type AuthedHandler<Ctx extends RouteContext> = (
  req: NextRequest,
  ctx: Ctx & { user: SafeUser },
) => Promise<Response> | Response;

export function withAdminAuth<Ctx extends RouteContext = RouteContext>(
  handler: AuthedHandler<Ctx>,
) {
  return async (req: NextRequest, ctx: Ctx): Promise<Response> => {
    if (!isSameOrigin(req)) return errorResponse("Forbidden", 403);
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);
    return handler(req, { ...ctx, user });
  };
}

export function withSuperAdminAuth<Ctx extends RouteContext = RouteContext>(
  handler: AuthedHandler<Ctx>,
) {
  return async (req: NextRequest, ctx: Ctx): Promise<Response> => {
    if (!isSameOrigin(req)) return errorResponse("Forbidden", 403);
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);
    if (user.role !== "super_admin") return errorResponse("Forbidden", 403);
    return handler(req, { ...ctx, user });
  };
}

export async function parseBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { success: false, response: errorResponse("Invalid JSON body", 400) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      response: errorResponse(first?.message ?? "Invalid request", 400),
    };
  }
  return { success: true, data: parsed.data };
}

export function logServerError(scope: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${scope}]`, error.message, error.stack);
  } else {
    console.error(`[${scope}]`, error);
  }
}
