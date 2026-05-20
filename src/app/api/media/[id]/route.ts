import "server-only";
import type { NextRequest } from "next/server";
import { mongoose } from "@/lib/db";
import { getBucket } from "@/lib/db/gridfs";
import { logServerError } from "@/lib/api-helpers";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const bucket = await getBucket();
    const objectId = new mongoose.Types.ObjectId(id);
    const files = await bucket.find({ _id: objectId }).limit(1).toArray();
    const file = files[0];
    if (!file) return new Response("Not found", { status: 404 });

    const nodeStream = bucket.openDownloadStream(objectId);
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });
    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": file.contentType ?? "application/octet-stream",
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"${file._id.toString()}"`,
      },
    });
  } catch (err) {
    logServerError("media-stream", err);
    return new Response("Not found", { status: 404 });
  }
}
