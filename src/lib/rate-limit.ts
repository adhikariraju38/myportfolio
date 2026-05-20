interface Bucket {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}

const buckets = new Map<string, Bucket>();
const GC_INTERVAL_MS = 5 * 60 * 1000;
let lastGc = Date.now();

function gc() {
  if (Date.now() - lastGc < GC_INTERVAL_MS) return;
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.resetAt < now && (!b.blockedUntil || b.blockedUntil < now)) {
      buckets.delete(k);
    }
  }
  lastGc = now;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number; blockMs?: number },
): RateLimitResult {
  gc();
  const now = Date.now();
  const b = buckets.get(key);

  if (b?.blockedUntil && b.blockedUntil > now) {
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil((b.blockedUntil - now) / 1000) };
  }

  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfterSec: 0 };
  }

  b.count += 1;
  if (b.count > options.limit) {
    b.blockedUntil = now + (options.blockMs ?? options.windowMs);
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil((b.blockedUntil - now) / 1000) };
  }
  return { allowed: true, remaining: options.limit - b.count, retryAfterSec: 0 };
}
