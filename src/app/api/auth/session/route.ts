import "server-only";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-helpers";

export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized", 401);
  return successResponse({ user });
}
