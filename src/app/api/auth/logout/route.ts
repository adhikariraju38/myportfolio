import "server-only";
import {
  clearSessionCookie,
  deleteSession,
  getSessionCookie,
} from "@/lib/auth";
import { errorResponse, successResponse, logServerError } from "@/lib/api-helpers";

export async function POST(): Promise<Response> {
  try {
    const token = await getSessionCookie();
    if (token) await deleteSession(token);
    await clearSessionCookie();
    return successResponse({ ok: true });
  } catch (err) {
    logServerError("logout", err);
    return errorResponse("Logout failed", 500);
  }
}
