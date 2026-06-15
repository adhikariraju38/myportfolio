import "server-only";
import type { NextRequest } from "next/server";
import { getMedia } from "@/lib/db/media";
import { logServerError } from "@/lib/api-helpers";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const file = await getMedia(id);
    if (!file) return new Response("Not found", { status: 404 });

    const body = new Uint8Array(file.data);
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Length": String(file.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"${id}"`,
      },
    });
  } catch (err) {
    logServerError("media-stream", err);
    return new Response("Not found", { status: 404 });
  }
}
