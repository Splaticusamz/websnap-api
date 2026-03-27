import { config } from "./config";

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    entry.timestamps = entry.timestamps.filter(
      (t) => now - t < config.rateLimits.business.windowMs
    );
    if (entry.timestamps.length === 0) store.delete(key);
  })
}, 5 * 60 * 1000);

export type Tier = "free" | "pro" | "business";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  headers: Record<string, string>;
}

export function checkRateLimit(key: string, tier: Tier): RateLimitResult {
  const { requests, windowMs } = config.rateLimits[tier];
  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  // Remove timestamps outside window
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
    },
  };
}
