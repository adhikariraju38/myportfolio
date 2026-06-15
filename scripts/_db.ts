/**
 * Standalone Drizzle client for CLI scripts (seeds). The app's `src/lib/db`
 * imports `server-only`, which throws under plain Node — so scripts build their
 * own client here and import only the (server-only-free) schema module.
 *
 * Run scripts with `tsx --env-file=.env.local scripts/<name>.ts` so
 * POSTGRES_URI is present in the environment.
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/lib/db/schema";

const url = process.env.POSTGRES_URI;
if (!url) throw new Error("POSTGRES_URI is required (run with --env-file=.env.local)");

export const client = postgres(url, {
  max: 1,
  ssl: url.includes("sslmode=require") ? "require" : undefined,
  prepare: false,
});

export const db = drizzle(client, { schema });
export * from "../src/lib/db/schema";
