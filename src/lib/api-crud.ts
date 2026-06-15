import "server-only";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { asc, eq, type SQL } from "drizzle-orm";
import type { ZodSchema } from "zod";
import {
  errorResponse,
  parseBody,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { db } from "@/lib/db";
import { serialize } from "@/lib/db/serialize";
import { CACHE_TAGS } from "@/lib/cache-tags";

// The CRUD helpers are generic over the Drizzle table. Precise typing across
// arbitrary tables adds no real safety here (the route configs keep type info),
// so the table is treated loosely — mirrors the old `Model<any>` pattern.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyTable = any;

type Tag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export interface CrudConfig<TCreate, TUpdate> {
  table: AnyTable;
  scope: string;
  createSchema: ZodSchema<TCreate>;
  updateSchema: ZodSchema<TUpdate>;
  orderBy?: (t: AnyTable) => SQL[];
  invalidate: readonly Tag[];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidId(id: string): boolean {
  return UUID_RE.test(id);
}

function defaultOrder(t: AnyTable): SQL[] {
  return [asc(t.orderIndex), asc(t.createdAt)];
}

function bumpTags(tags: readonly Tag[]): void {
  for (const t of tags) revalidateTag(t, "max");
  revalidateTag(CACHE_TAGS.all, "max");
}

function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: string; message?: string };
  return e.code === "23505" || (typeof e.message === "string" && /duplicate key/i.test(e.message));
}

export function crudList<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (req: NextRequest) => {
    try {
      const url = new URL(req.url);
      const limit = Math.min(Number(url.searchParams.get("limit") ?? "200"), 500);
      const order = (cfg.orderBy ?? defaultOrder)(cfg.table);
      const rows = await db
        .select()
        .from(cfg.table)
        .orderBy(...order)
        .limit(limit);
      return successResponse(serialize(rows as Record<string, unknown>[]));
    } catch (err) {
      logServerError(`${cfg.scope}.list`, err);
      return errorResponse("Failed to load", 500);
    }
  });
}

export function crudCreate<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (req) => {
    const parsed = await parseBody(req, cfg.createSchema);
    if (!parsed.success) return parsed.response;
    try {
      const [row] = await db
        .insert(cfg.table)
        .values(parsed.data as unknown as Record<string, unknown>)
        .returning();
      bumpTags(cfg.invalidate);
      return successResponse(serialize(row as Record<string, unknown>), 201);
    } catch (err) {
      logServerError(`${cfg.scope}.create`, err);
      return errorResponse(
        isUniqueViolation(err) ? "Duplicate value (slug/key already exists)" : "Create failed",
        400,
      );
    }
  });
}

export function crudDetail<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (_req, ctx) => {
    const id = (await ctx.params)?.id ?? "";
    if (!isValidId(id)) return errorResponse("Invalid id", 400);
    try {
      const [row] = await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1);
      if (!row) return errorResponse("Not found", 404);
      return successResponse(serialize(row as Record<string, unknown>));
    } catch (err) {
      logServerError(`${cfg.scope}.detail`, err);
      return errorResponse("Failed to load", 500);
    }
  });
}

export function crudUpdate<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (req, ctx) => {
    const id = (await ctx.params)?.id ?? "";
    if (!isValidId(id)) return errorResponse("Invalid id", 400);
    const parsed = await parseBody(req, cfg.updateSchema);
    if (!parsed.success) return parsed.response;
    try {
      const [row] = await db
        .update(cfg.table)
        .set(parsed.data as unknown as Record<string, unknown>)
        .where(eq(cfg.table.id, id))
        .returning();
      if (!row) return errorResponse("Not found", 404);
      bumpTags(cfg.invalidate);
      return successResponse(serialize(row as Record<string, unknown>));
    } catch (err) {
      logServerError(`${cfg.scope}.update`, err);
      return errorResponse(
        isUniqueViolation(err) ? "Duplicate value (slug/key already exists)" : "Update failed",
        400,
      );
    }
  });
}

export function crudDelete<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (_req, ctx) => {
    const id = (await ctx.params)?.id ?? "";
    if (!isValidId(id)) return errorResponse("Invalid id", 400);
    try {
      const [row] = await db
        .delete(cfg.table)
        .where(eq(cfg.table.id, id))
        .returning({ id: cfg.table.id });
      if (!row) return errorResponse("Not found", 404);
      bumpTags(cfg.invalidate);
      return successResponse({ ok: true });
    } catch (err) {
      logServerError(`${cfg.scope}.delete`, err);
      return errorResponse("Delete failed", 500);
    }
  });
}

export function singletonGet(table: AnyTable, scope: string) {
  return withAdminAuth(async () => {
    try {
      const [row] = await db.select().from(table).where(eq(table.key, "default")).limit(1);
      return successResponse(row ? serialize(row as Record<string, unknown>) : null);
    } catch (err) {
      logServerError(`${scope}.get`, err);
      return errorResponse("Failed to load", 500);
    }
  });
}

export function singletonPatch<T>(
  table: AnyTable,
  scope: string,
  schema: ZodSchema<T>,
  invalidate: readonly Tag[],
) {
  return withAdminAuth(async (req) => {
    const parsed = await parseBody(req, schema);
    if (!parsed.success) return parsed.response;
    try {
      const data = parsed.data as Record<string, unknown>;
      const [row] = await db
        .insert(table)
        .values({ key: "default", ...data })
        .onConflictDoUpdate({
          target: table.key,
          set: { ...data, updatedAt: new Date() },
        })
        .returning();
      bumpTags(invalidate);
      return successResponse(serialize(row as Record<string, unknown>));
    } catch (err) {
      logServerError(`${scope}.patch`, err);
      return errorResponse("Update failed", 400);
    }
  });
}

export async function reorderHandler(req: NextRequest, table: AnyTable, invalidate: readonly Tag[]) {
  type Item = { id: string; orderIndex: number };
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON", 400);
  }
  const items = (body as { items?: Item[] }).items;
  if (!Array.isArray(items) || items.length === 0) return errorResponse("items[] required", 400);
  if (items.some((it) => !isValidId(it.id) || typeof it.orderIndex !== "number")) {
    return errorResponse("Invalid item shape", 400);
  }

  try {
    await db.transaction(async (tx) => {
      for (const it of items) {
        await tx
          .update(table)
          .set({ orderIndex: it.orderIndex, updatedAt: new Date() })
          .where(eq(table.id, it.id));
      }
    });
    bumpTags(invalidate);
    return successResponse({ updated: items.length });
  } catch (err) {
    logServerError("reorder", err);
    return errorResponse("Reorder failed", 500);
  }
}
