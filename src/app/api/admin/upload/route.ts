import "server-only";
import type { NextRequest } from "next/server";
import { errorResponse, successResponse, withAdminAuth, logServerError } from "@/lib/api-helpers";
import { insertMedia } from "@/lib/db/media";

export const runtime = "nodejs";

const ALLOWED_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/gif",
  "application/pdf",
]);

const MAX_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 10_485_760);

export const POST = withAdminAuth(async (req: NextRequest, { user }) => {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return errorResponse("Multipart form required", 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return errorResponse("file field is required", 400);
  if (file.size === 0) return errorResponse("Empty file", 400);
  if (file.size > MAX_BYTES) return errorResponse("File too large", 400);
  if (!ALLOWED_MIMES.has(file.type)) {
    return errorResponse(`Unsupported file type: ${file.type}`, 400);
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const filename = file.name || `upload-${Date.now()}`;
    const id = await insertMedia({
      filename,
      contentType: file.type,
      size: file.size,
      data: buf,
      uploadedBy: user.id,
    });

    return successResponse({
      id,
      url: `/api/media/${id}`,
      mimeType: file.type,
      size: file.size,
      filename,
    });
  } catch (err) {
    logServerError("upload", err);
    return errorResponse("Upload failed", 500);
  }
});
