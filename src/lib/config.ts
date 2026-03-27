export const config = {
  maxFetchTimeout: 10_000,
  maxContentLength: 5_000,
  maxLinks: 50,
  maxImages: 30,
  userAgent: "WebSnapBot/1.0 (+https://websnap-api.vercel.app)",
  rateLimits: {
    free: { requests: 100, windowMs: 15 * 60 * 1000 },
    pro: { requests: 1000, windowMs: 15 * 60 * 1000 },
    business: { requests: 5000, windowMs: 15 * 60 * 1000 },
  },
} as const;
