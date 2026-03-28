import { loadApiKeys } from "./auth";
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

export interface RateLimitSnapshotEntry {
  subject: string;
  tier: Tier;
  requestCount: number;
  limit: number;
  remaining: number;
  resetMs: number;
  lastRequestAt: number | null;
}

export function getRateLimitSnapshot(): RateLimitSnapshotEntry[] {
  const now = Date.now();
  const apiKeys = loadApiKeys();

  return Array.from(store.entries()).map(([subject, entry]) => {
    const rawKey = subject.startsWith("key:") ? subject.slice(4) : null;
    const matchedKey = rawKey ? apiKeys.find((apiKey) => apiKey.key === rawKey) : null;
    const tier = matchedKey?.tier ?? "free";
    const plan = getPlan(tier);
    const timestamps = entry.timestamps.filter((t) => now - t < plan.windowMs);
    const oldestInWindow = timestamps[0] ?? now;

    return {
      subject,
      tier,
      requestCount: timestamps.length,
      limit: plan.requestsPerWindow,
      remaining: Math.max(0, plan.requestsPerWindow - timestamps.length),
      resetMs: oldestInWindow + plan.windowMs,
      lastRequestAt: timestamps[timestamps.length - 1] ?? null,
    };
  });
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
