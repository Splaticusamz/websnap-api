# WebSnap API — Full Specification

## Base URL

Production: `https://websnap-api.vercel.app`

## Authentication

- Free tier requests can be tested without an API key.
- Paid plans should send `x-api-key`.
- Webhook automation uses `x-websnap-webhook-secret`.
- Ops automation uses `Authorization: Bearer <WEBSNAP_OPS_TOKEN>` when configured.
- Paid keys can be seeded via `API_KEYS_JSON` or issued as signed stateless keys when `WEBSNAP_API_KEY_SIGNING_SECRET` is configured.

## Endpoints

### POST /api/snap

Extract structured data from a public URL.

**Headers:**
- `Content-Type: application/json`
- `x-api-key: your-key` (optional for free tier, expected for paid plans)

**Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "includeContent": true,
    "includeTechStack": true,
    "includePerformance": true
  }
}
```

**Response (200):**
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "...",
  "canonical": "https://example.com",
  "favicon": "https://example.com/favicon.ico",
  "ogTags": {},
  "twitterCard": {},
  "meta": {},
  "headings": { "h1": ["..."], "h2": ["..."], "h3": [] },
  "contact": {
    "emails": ["hello@example.com"],
    "phones": [],
    "socialProfiles": [{ "platform": "linkedin", "url": "https://linkedin.com/company/example" }]
  },
  "structuredData": [{ "@type": "Organization" }],
  "mainContent": "...",
  "links": [],
  "images": [],
  "techStack": [],
  "performance": {
    "fetchTimeMs": 234,
    "contentLength": 15420,
    "statusCode": 200
  }
}
```

**Rate-limit headers:**
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `X-RateLimit-Plan`
- `X-RateLimit-Window`

**Errors:**
- `400` — Missing or invalid URL / JSON
- `422` — Non-HTML content
- `429` — Rate limit exceeded
- `502` — Target URL unreachable
- `504` — Target URL timed out

### GET /api/health

Returns service status. No auth required.

### POST /api/billing/checkout

Resolve the current checkout path for `pro` or `business`.

**Body:**
```json
{
  "plan": "pro",
  "email": "buyer@example.com"
}
```

**Responses:**
- `200` — hosted checkout URL available
- `503` — manual fallback or price-id-only configuration detected

### POST /api/billing/webhook

Receives billing events for plan mapping / provisioning.

**Headers:**
- `Content-Type: application/json`
- `x-websnap-webhook-secret: <configured secret>`

**Response:**
Returns the derived plan tier, customer email (when present), event type, and next recommended provisioning action.

### POST /api/ops/provision-key

Protected operator endpoint for issuing a signed stateless API key without a database.

**Headers:**
- `Authorization: Bearer <WEBSNAP_OPS_TOKEN>`

**Body:**
```json
{
  "plan": "pro",
  "name": "Acme",
  "email": "buyer@example.com",
  "daysValid": 30
}
```

**Response:**
Returns the plaintext API key, a masked preview, expiry (if supplied), and a ready-to-run curl example.

### GET /api/ops/status

Internal automation endpoint for cron or monitoring.

**Headers:**
- `Authorization: Bearer <WEBSNAP_OPS_TOKEN>` (optional if using cron-source fallback)

**Response:**
Returns automation readiness, provisioning mode, plan summary, and app metadata.

## Rate Limits

| Tier | Requests / 15m | Approx monthly | Burst/min |
|------|----------------|----------------|-----------|
| Free | 25 | 3,000 | 10 |
| Pro | 1,000 | 10,000 | 100 |
| Business | 5,000 | 100,000 | 1,000 |

## Use Cases

- lead enrichment from company homepages
- contact + social signal extraction for outbound workflows
- article / docs ingestion for AI agents
- scheduled metadata snapshots in cron jobs
- webhook-triggered URL parsing in automations
- tech stack lookup before outreach
- SEO / content extraction for internal tools
