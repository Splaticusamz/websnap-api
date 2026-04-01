/**
 * Simple in-memory IP-based rate limiter for unauthenticated (free) and demo requests.
 */

interface IPEntry {
  count: number;
  resetTime: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const freeTierStore = new Map<string, IPEntry>();
const demoStore = new Map<string, IPEntry>();

function checkIPLimit(
  store: Map<string, IPEntry>,
  ip: string,
  maxPerDay: number
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now >= entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + DAY_MS });
    return { allowed: true, remaining: maxPerDay - 1, resetMs: now + DAY_MS };
  }

  if (entry.count >= maxPerDay) {
    return { allowed: false, remaining: 0, resetMs: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: maxPerDay - entry.count, resetMs: entry.resetTime };
}

export function checkFreeTierLimit(ip: string) {
  return checkIPLimit(freeTierStore, ip, 10);
}

export function checkDemoLimit(ip: string) {
  return checkIPLimit(demoStore, ip, 3);
}

// Periodic cleanup every 10 minutes
setInterval(() => {
  const now = Date.now();
  [freeTierStore, demoStore].forEach((store) => {
    store.forEach((entry, key) => {
      if (now >= entry.resetTime) store.delete(key);
    });
  });
}, 10 * 60 * 1000);
