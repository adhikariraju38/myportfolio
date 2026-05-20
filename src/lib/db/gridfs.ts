import "server-only";
import { mongoose, getDb } from "@/lib/db";

const BUCKET_NAME = "media";

export async function getBucket(): Promise<mongoose.mongo.GridFSBucket> {
  await getDb();
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB not connected");
  return new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET_NAME });
}

export interface GridFSFileMeta {
  id: string;
  filename: string;
  contentType: string;
  length: number;
  uploadDate: Date;
  metadata?: Record<string, unknown>;
}

export async function listFiles(limit = 200): Promise<GridFSFileMeta[]> {
  const bucket = await getBucket();
  const docs = await bucket.find({}).sort({ uploadDate: -1 }).limit(limit).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    filename: d.filename,
    contentType: d.contentType ?? "application/octet-stream",
    length: d.length,
    uploadDate: d.uploadDate,
    metadata: (d.metadata as Record<string, unknown> | undefined) ?? undefined,
  }));
}

export async function deleteFile(id: string): Promise<void> {
  const bucket = await getBucket();
  try {
    await bucket.delete(new mongoose.Types.ObjectId(id));
  } catch (err) {
    // ignore "not found" — caller treats as idempotent
    if (!(err instanceof Error) || !/file not found/i.test(err.message)) throw err;
  }
}
