import "server-only";
import mongoose from "mongoose";

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
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment.");
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: "myportfolio",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { mongoose };
