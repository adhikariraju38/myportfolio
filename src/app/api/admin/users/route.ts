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
import { userCreateSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

export const GET = withSuperAdminAuth(async () => {
  try {
    await getDb();
    const docs = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    return successResponse(serialize(docs as Record<string, unknown>[]));
  } catch (err) {
    logServerError("users.list", err);
    return errorResponse("Failed to load", 500);
  }
});

export const POST = withSuperAdminAuth(async (req) => {
  const parsed = await parseBody(req, userCreateSchema);
  if (!parsed.success) return parsed.response;
  try {
    await getDb();
    const passwordHash = await hashPassword(parsed.data.password);
    const doc = await User.create({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      role: parsed.data.role,
      isActive: parsed.data.isActive,
      passwordHash,
    });
    const obj = doc.toObject() as Record<string, unknown>;
    delete obj.passwordHash;
    return successResponse(serialize(obj), 201);
  } catch (err) {
    logServerError("users.create", err);
    const msg =
      err instanceof Error && /duplicate key/i.test(err.message) ? "Email already exists" : "Create failed";
    return errorResponse(msg, 400);
  }
});
