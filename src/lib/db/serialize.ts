import "server-only";
import { Types } from "mongoose";

type Plain = Record<string, unknown>;

function isObjectId(v: unknown): v is Types.ObjectId {
  return v instanceof Types.ObjectId;
}

function serializeValue(v: unknown): unknown {
  if (v === null || v === undefined) return v;
  if (isObjectId(v)) return v.toString();
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return v.map(serializeValue);
  if (typeof v === "object") return serializeObject(v as Plain);
  return v;
}

function serializeObject(obj: Plain): Plain {
  const out: Plain = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "__v") continue;
    if (k === "_id") {
      out.id = serializeValue(v);
      continue;
    }
    out[k] = serializeValue(v);
  }
  return out;
}

export function serialize<T extends Plain | Plain[]>(
  input: T,
): T extends Plain[] ? Plain[] : Plain {
  if (Array.isArray(input)) {
    return input.map((d) => serializeObject(d)) as never;
  }
  return serializeObject(input as Plain) as never;
}
