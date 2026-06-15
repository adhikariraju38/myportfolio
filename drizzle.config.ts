import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load local env first, then production-local, then plain .env (CI fallback).
config({ path: ".env.local" });
config({ path: ".env.production.local" });
config({ path: ".env" });

if (!process.env.POSTGRES_URI) {
  throw new Error("POSTGRES_URI is required in .env.local for drizzle-kit");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URI,
  },
  strict: true,
  verbose: true,
});
