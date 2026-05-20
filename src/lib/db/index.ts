import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment.");
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = global as unknown as { _mongoose?: Cached };

const cached: Cached = globalForMongoose._mongoose ?? { conn: null, promise: null };
if (!globalForMongoose._mongoose) {
  globalForMongoose._mongoose = cached;
}

export async function getDb(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      dbName: "myportfolio",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { mongoose };
