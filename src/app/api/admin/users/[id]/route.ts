import "server-only";
import { eq } from "drizzle-orm";
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
import { userUpdateSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

const isValidId = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

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

export const PATCH = withSuperAdminAuth(async (req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  const parsed = await parseBody(req, userUpdateSchema);
  if (!parsed.success) return parsed.response;
  try {
    const update: Partial<typeof users.$inferInsert> = {};
    if (parsed.data.name !== undefined) update.name = parsed.data.name;
    if (parsed.data.role !== undefined) update.role = parsed.data.role;
    if (parsed.data.isActive !== undefined) update.isActive = parsed.data.isActive;
    if (parsed.data.password) update.passwordHash = await hashPassword(parsed.data.password);

    const [row] = await db.update(users).set(update).where(eq(users.id, id)).returning(safeColumns);
    if (!row) return errorResponse("Not found", 404);
    return successResponse(serialize(row as Record<string, unknown>));
  } catch (err) {
    logServerError("users.update", err);
    return errorResponse("Update failed", 400);
  }
});

export const DELETE = withSuperAdminAuth(async (_req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  try {
    if (ctx.user.id === id) return errorResponse("Cannot delete yourself", 400);
    const [row] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    if (!row) return errorResponse("Not found", 404);
    return successResponse({ ok: true });
  } catch (err) {
    logServerError("users.delete", err);
    return errorResponse("Delete failed", 500);
  }
});
