import "server-only";
import type { NextRequest } from "next/server";
import { Readable } from "stream";
import { errorResponse, successResponse, withAdminAuth, logServerError } from "@/lib/api-helpers";
import { getBucket } from "@/lib/db/gridfs";

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

  const bucket = await getBucket();
  const filename = file.name || `upload-${Date.now()}`;
  const upload = bucket.openUploadStream(filename, {
    contentType: file.type,
    metadata: { uploaderId: user.id, uploadedAt: new Date() },
  });

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    await new Promise<void>((resolve, reject) => {
      Readable.from(buf)
        .pipe(upload)
        .on("error", reject)
        .on("finish", () => resolve());
    });
  } catch (err) {
    logServerError("upload", err);
    try {
      await bucket.delete(upload.id);
    } catch {
      // ignore
    }
    return errorResponse("Upload failed", 500);
  }

  return successResponse({
    id: upload.id.toString(),
    url: `/api/media/${upload.id.toString()}`,
    mimeType: file.type,
    size: file.size,
    filename,
  });
});
