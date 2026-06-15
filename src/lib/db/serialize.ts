import "server-only";

type Plain = Record<string, unknown>;

// Drizzle rows already expose `id` (uuid string) and plain JS values for jsonb /
// text[] columns. The only non-JSON-safe values are `Date` timestamps, which we
// convert to ISO strings so the API contract matches what the client expects.
function serializeValue(v: unknown): unknown {
  if (v === null || v === undefined) return v;
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return v.map(serializeValue);
  if (typeof v === "object") return serializeObject(v as Plain);
  return v;
}

function serializeObject(obj: Plain): Plain {
  const out: Plain = {};
  for (const [k, v] of Object.entries(obj)) {
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
