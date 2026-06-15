/**
 * Idempotent migration runner. Applies every committed Drizzle migration in
 * src/lib/db/migrations. Safe to run on every deploy — drizzle records applied
 * migrations in the `__drizzle_migrations` table and skips ones already run.
 *
 *   Local:  npm run db:migrate          (dotenv loads POSTGRES_URI from .env.local)
 *   Vercel: runs inside `vercel-build`, using POSTGRES_URI from project env vars.
 */
import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

config({ path: ".env.local" });
config({ path: ".env.production.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.POSTGRES_URI;
  if (!url) throw new Error("POSTGRES_URI is not set");

  const client = postgres(url, {
    max: 1,
    ssl: url.includes("sslmode=require") ? "require" : undefined,
    prepare: false,
  });
  const db = drizzle(client);

  console.log("[migrate] applying migrations…");
  await migrate(db, { migrationsFolder: "./src/lib/db/migrations" });
  console.log("[migrate] done");
  await client.end();
}

main().catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
