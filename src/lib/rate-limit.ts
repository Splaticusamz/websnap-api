import { getPlan } from "./plans";
import type { Tier } from "./plans";

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    entry.timestamps = entry.timestamps.filter((t) => now - t < getPlan("business").windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  });
}, 5 * 60 * 1000);

export type { Tier };

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  headers: Record<string, string>;
}

export function checkRateLimit(key: string, tier: Tier): RateLimitResult {
  const plan = getPlan(tier);
  const { requestsPerWindow: requests, windowMs } = plan;
  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  const remaining = Math.max(0, requests - entry.timestamps.length);
  const oldestInWindow = entry.timestamps[0] ?? now;
  const resetMs = oldestInWindow + windowMs;

  const allowed = entry.timestamps.length < requests;
  if (allowed) {
    entry.timestamps.push(now);
    store.set(key, entry);
  }

  return {
    allowed,
    limit: requests,
    remaining: allowed ? remaining - 1 : 0,
    resetMs,
    headers: {
      "X-RateLimit-Limit": String(requests),
      "X-RateLimit-Remaining": String(allowed ? remaining - 1 : 0),
      "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
      "X-RateLimit-Plan": tier,
      "X-RateLimit-Window": plan.requestWindowLabel,
    },
  };
}
