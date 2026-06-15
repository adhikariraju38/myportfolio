import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URI;
if (!connectionString) {
  throw new Error("POSTGRES_URI is not defined in environment.");
}

const isProduction = process.env.NODE_ENV === "production";

// One connection pool per process. Next.js hot-reload re-instantiates modules in
// dev, so cache the client on globalThis to avoid leaking connections.
declare global {
  var __myportfolio_pg: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__myportfolio_pg ??
  postgres(connectionString, {
    max: isProduction ? 10 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    // Neon (and most managed PG) require TLS; the URL carries `sslmode=require`.
    ssl: connectionString.includes("sslmode=require") ? "require" : undefined,
    // PgBouncer/transaction-pooled endpoints don't support prepared statements.
    prepare: false,
  });

if (!isProduction) globalThis.__myportfolio_pg = client;

export const db = drizzle(client, { schema });
export type Database = typeof db;
export { client };
