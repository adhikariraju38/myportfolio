import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";

// Media is stored as `bytea` rows in Postgres (replaces MongoDB GridFS). The
// public URL (`/api/media/<id>`) and upload contract are unchanged — only the
// id format moved from a 24-char hex ObjectId to a uuid.

export interface MediaFileMeta {
  id: string;
  filename: string;
  contentType: string;
  length: number;
  uploadDate: Date;
}

export async function insertMedia(input: {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  uploadedBy?: string | null;
}): Promise<string> {
  const [row] = await db
    .insert(media)
    .values({
      filename: input.filename,
      contentType: input.contentType,
      size: input.size,
      data: input.data,
      uploadedBy: input.uploadedBy ?? null,
    })
    .returning({ id: media.id });
  if (!row) throw new Error("Failed to insert media");
  return row.id;
}

export async function getMedia(
  id: string,
): Promise<{ data: Buffer; contentType: string; size: number } | null> {
  const [row] = await db
    .select({ data: media.data, contentType: media.contentType, size: media.size })
    .from(media)
    .where(eq(media.id, id))
    .limit(1);
  if (!row) return null;
  return { data: row.data, contentType: row.contentType, size: row.size };
}

export async function listFiles(limit = 200): Promise<MediaFileMeta[]> {
  const rows = await db
    .select({
      id: media.id,
      filename: media.filename,
      contentType: media.contentType,
      size: media.size,
      createdAt: media.createdAt,
    })
    .from(media)
    .orderBy(desc(media.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    filename: r.filename,
    contentType: r.contentType,
    length: r.size,
    uploadDate: r.createdAt,
  }));
}

export async function deleteFile(id: string): Promise<void> {
  await db.delete(media).where(eq(media.id, id));
}
