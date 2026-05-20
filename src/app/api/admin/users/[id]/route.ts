import "server-only";
import {
  errorResponse,
  parseBody,
  successResponse,
  withSuperAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { User } from "@/lib/db/models";
import { serialize } from "@/lib/db/serialize";
import { userUpdateSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

const isValidId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export const PATCH = withSuperAdminAuth(async (req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  const parsed = await parseBody(req, userUpdateSchema);
  if (!parsed.success) return parsed.response;
  try {
    await getDb();
    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.password) {
      update.passwordHash = await hashPassword(parsed.data.password);
      delete update.password;
    }
    const doc = await User.findByIdAndUpdate(id, { $set: update }, { new: true })
      .select("-passwordHash")
      .lean();
    if (!doc) return errorResponse("Not found", 404);
    return successResponse(serialize(doc as Record<string, unknown>));
  } catch (err) {
    logServerError("users.update", err);
    return errorResponse("Update failed", 400);
  }
});

export const DELETE = withSuperAdminAuth(async (_req, ctx) => {
  const id = (await ctx.params)?.id ?? "";
  if (!isValidId(id)) return errorResponse("Invalid id", 400);
  try {
    await getDb();
    if (ctx.user.id === id) return errorResponse("Cannot delete yourself", 400);
    const doc = await User.findByIdAndDelete(id);
    if (!doc) return errorResponse("Not found", 404);
    return successResponse({ ok: true });
  } catch (err) {
    logServerError("users.delete", err);
    return errorResponse("Delete failed", 500);
  }
});
