import "server-only";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import type { ZodSchema } from "zod";
import {
  errorResponse,
  parseBody,
  successResponse,
  withAdminAuth,
  logServerError,
} from "@/lib/api-helpers";
import { getDb, mongoose } from "@/lib/db";
import { serialize } from "@/lib/db/serialize";
import { CACHE_TAGS } from "@/lib/cache-tags";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = import("mongoose").Model<any>;

type Tag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export interface CrudConfig<TCreate, TUpdate> {
  model: AnyModel;
  scope: string;
  createSchema: ZodSchema<TCreate>;
  updateSchema: ZodSchema<TUpdate>;
  defaultSort?: Record<string, 1 | -1>;
  invalidate: readonly Tag[];
}

function isValidId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

function bumpTags(tags: readonly Tag[]): void {
  for (const t of tags) revalidateTag(t, "max");
  revalidateTag(CACHE_TAGS.all, "max");
}

export function crudList<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (req: NextRequest) => {
    try {
      await getDb();
      const url = new URL(req.url);
      const limit = Math.min(Number(url.searchParams.get("limit") ?? "200"), 500);
      const docs = await cfg.model
        .find({})
        .sort(cfg.defaultSort ?? { orderIndex: 1, createdAt: 1 })
        .limit(limit)
        .lean<Record<string, unknown>[]>();
      return successResponse(serialize(docs));
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
      await getDb();
      const created = await cfg.model.create(parsed.data as Record<string, unknown>);
      bumpTags(cfg.invalidate);
      return successResponse(serialize(created.toObject() as Record<string, unknown>), 201);
    } catch (err) {
      logServerError(`${cfg.scope}.create`, err);
      const message =
        err instanceof Error && /duplicate key/i.test(err.message)
          ? "Duplicate value (slug/key already exists)"
          : "Create failed";
      return errorResponse(message, 400);
    }
  });
}

export function crudDetail<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (_req, ctx) => {
    const id = (await ctx.params)?.id ?? "";
    if (!isValidId(id)) return errorResponse("Invalid id", 400);
    try {
      await getDb();
      const doc = await cfg.model.findById(id).lean<Record<string, unknown>>();
      if (!doc) return errorResponse("Not found", 404);
      return successResponse(serialize(doc));
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
      await getDb();
      const updated = await cfg.model
        .findByIdAndUpdate(
          id,
          { $set: parsed.data as Record<string, unknown> },
          { new: true, runValidators: true },
        )
        .lean<Record<string, unknown>>();
      if (!updated) return errorResponse("Not found", 404);
      bumpTags(cfg.invalidate);
      return successResponse(serialize(updated));
    } catch (err) {
      logServerError(`${cfg.scope}.update`, err);
      return errorResponse("Update failed", 400);
    }
  });
}

export function crudDelete<TC, TU>(cfg: CrudConfig<TC, TU>) {
  return withAdminAuth(async (_req, ctx) => {
    const id = (await ctx.params)?.id ?? "";
    if (!isValidId(id)) return errorResponse("Invalid id", 400);
    try {
      await getDb();
      const deleted = await cfg.model.findByIdAndDelete(id);
      if (!deleted) return errorResponse("Not found", 404);
      bumpTags(cfg.invalidate);
      return successResponse({ ok: true });
    } catch (err) {
      logServerError(`${cfg.scope}.delete`, err);
      return errorResponse("Delete failed", 500);
    }
  });
}

export function singletonGet(model: AnyModel, scope: string) {
  return withAdminAuth(async () => {
    try {
      await getDb();
      const doc = await model.findOne({ key: "default" }).lean<Record<string, unknown>>();
      return successResponse(doc ? serialize(doc) : null);
    } catch (err) {
      logServerError(`${scope}.get`, err);
      return errorResponse("Failed to load", 500);
    }
  });
}

export function singletonPatch<T>(
  model: AnyModel,
  scope: string,
  schema: ZodSchema<T>,
  invalidate: readonly Tag[],
) {
  return withAdminAuth(async (req) => {
    const parsed = await parseBody(req, schema);
    if (!parsed.success) return parsed.response;
    try {
      await getDb();
      const updated = await model
        .findOneAndUpdate(
          { key: "default" },
          { $set: parsed.data as Record<string, unknown>, $setOnInsert: { key: "default" } },
          { new: true, upsert: true, runValidators: true },
        )
        .lean<Record<string, unknown>>();
      bumpTags(invalidate);
      return successResponse(serialize(updated as Record<string, unknown>));
    } catch (err) {
      logServerError(`${scope}.patch`, err);
      return errorResponse("Update failed", 400);
    }
  });
}

export async function reorderHandler(
  req: NextRequest,
  model: AnyModel,
  invalidate: readonly Tag[],
) {
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
    await getDb();
    const ops = items.map((it) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(it.id) },
        update: { $set: { orderIndex: it.orderIndex } },
      },
    }));
    await model.bulkWrite(ops);
    bumpTags(invalidate);
    return successResponse({ updated: items.length });
  } catch (err) {
    logServerError("reorder", err);
    return errorResponse("Reorder failed", 500);
  }
}
