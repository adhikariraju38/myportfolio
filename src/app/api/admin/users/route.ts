import "server-only";
import { desc } from "drizzle-orm";
import {
  errorResponse,
  parseBody,
  successResponse,
  withSuperAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { serialize } from "@/lib/db/serialize";
import { userCreateSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

const safeColumns = {
  id: users.id,
  email: users.email,
  name: users.name,
  role: users.role,
  isActive: users.isActive,
  lastLoginAt: users.lastLoginAt,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

function isDuplicate(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: string; message?: string };
  return e.code === "23505" || (typeof e.message === "string" && /duplicate key/i.test(e.message));
}

export const GET = withSuperAdminAuth(async () => {
  try {
    const rows = await db.select(safeColumns).from(users).orderBy(desc(users.createdAt));
    return successResponse(serialize(rows as Record<string, unknown>[]));
  } catch (err) {
    logServerError("users.list", err);
    return errorResponse("Failed to load", 500);
  }
});

export const POST = withSuperAdminAuth(async (req) => {
  const parsed = await parseBody(req, userCreateSchema);
  if (!parsed.success) return parsed.response;
  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const [row] = await db
      .insert(users)
      .values({
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name,
        role: parsed.data.role,
        isActive: parsed.data.isActive,
        passwordHash,
      })
      .returning(safeColumns);
    return successResponse(serialize(row as Record<string, unknown>), 201);
  } catch (err) {
    logServerError("users.create", err);
    return errorResponse(isDuplicate(err) ? "Email already exists" : "Create failed", 400);
  }
});
