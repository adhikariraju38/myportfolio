import {
  errorResponse,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { listFiles } from "@/lib/db/media";

export const GET = withAdminAuth(async () => {
  try {
    const files = await listFiles(500);
    return successResponse(files);
  } catch (err) {
    logServerError("media.list", err);
    return errorResponse("Failed to load", 500);
  }
});
