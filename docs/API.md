# WebSnap API — Full Specification

## Base URL

Production: `https://websnap-api.vercel.app`

## Authentication

All requests require an `x-api-key` header.

## Endpoints

### POST /api/snap

Extract structured data from a URL.

**Headers:**
- `Content-Type: application/json`
- `x-api-key: your-key`

**Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "includeContent": true,
    "includeTechStack": true,
    "includeLinks": true,
    "includeImages": true,
    "maxContentLength": 5000
  }
}
```

**Response (200):**
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "...",
  "ogTags": {},
  "favicon": "...",
  "mainContent": "...",
  "links": [],
  "images": [],
  "techStack": [],
  "performance": {
    "responseTimeMs": 234,
    "contentSizeBytes": 15420,
    "fetchedAt": "2026-03-27T00:00:00Z"
  }
}
```

**Errors:**
- `400` — Missing or invalid URL
- `401` — Missing/invalid API key
- `429` — Rate limit exceeded
- `502` — Target URL unreachable

### GET /api/health

Returns service status. No auth required.

## Rate Limits

| Tier | Requests/day | Burst/min |
|------|-------------|-----------|
| Free | 100 | 10 |
| Pro | 10,000 | 100 |
| Enterprise | 100,000 | 1,000 |
