# RapidAPI Listing — WebSnap API

## Marketplace Title

**WebSnap API — Webpage to Structured JSON**

## Short Description

Turn any public webpage into structured JSON in one API call. Extract metadata, OG tags, links, images, tech stack, contact signals, headings, JSON-LD, and cleaned main content. Built for AI agents, lead enrichment, automations, and developer workflows.

## Long Description

WebSnap API extracts structured data from any public webpage without running a headless browser. Send a URL, get back a rich JSON object containing:

- Title, description, canonical URL, favicon
- Open Graph and Twitter Card tags
- Internal/external links with anchor text
- Images with alt text and dimensions
- Cleaned main body content (nav/script noise removed)
- Tech stack detection (frameworks, CDNs, CMSs, analytics)
- Contact signals (emails, phone numbers, social profiles)
- Headings hierarchy (h1, h2, h3)
- Parsed JSON-LD structured data blocks
- Performance metrics (fetch time, content length, status code)

Ideal for AI agent builders, outbound sales teams, SEO tool developers, and automation engineers.

## Category Suggestions

- **Primary:** Data
- **Secondary:** Developer Tools, Web Scraping, AI Tools

## Tags

web scraping, metadata extraction, open graph, tech stack detection, lead enrichment, ai agents, automation, seo, content extraction, json-ld, url parser, webpage analysis

---

## Endpoint Documentation

### `POST /api/snap`

Extract structured data from a webpage.

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `x-api-key` | No | Your API key. Omit for free tier (10 req/day per IP). |

**Request Body:**

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

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | Public HTTP/HTTPS URL to extract |
| `options.includeContent` | boolean | No | Include cleaned main body text (default: true) |
| `options.includeTechStack` | boolean | No | Include tech stack detection (default: true) |
| `options.includePerformance` | boolean | No | Include fetch timing and size (default: true) |

**Response (200):**

```json
{
  "url": "https://example.com/",
  "title": "Example Domain",
  "description": "Example website for demonstrations.",
  "canonical": "https://example.com/",
  "favicon": "https://example.com/favicon.ico",
  "ogTags": {
    "title": "Example Domain",
    "description": "...",
    "image": null,
    "type": "website",
    "url": "https://example.com/",
    "siteName": "Example"
  },
  "twitterCard": { "card": null, "title": null, "description": null, "image": null },
  "links": [{ "href": "https://...", "text": "Link text", "isExternal": true }],
  "images": [{ "src": "https://...", "alt": "Alt text" }],
  "meta": { "language": "en", "charset": "utf-8", "viewport": "...", "robots": null },
  "headings": { "h1": ["Main Heading"], "h2": [], "h3": [] },
  "contact": { "emails": [], "phones": [], "socialProfiles": [] },
  "structuredData": [],
  "mainContent": "Cleaned body text...",
  "techStack": [{ "name": "Cloudflare", "confidence": "high", "evidence": "..." }],
  "performance": { "fetchTimeMs": 142, "contentLength": 1256, "statusCode": 200 }
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Invalid JSON body or missing/invalid URL |
| 422 | Non-HTML content type |
| 429 | Rate limit exceeded (includes `upgrade` URL and `retryAfterMs`) |
| 502 | Failed to fetch target URL |
| 504 | Target URL timed out |

**Rate Limit Headers (all responses):**

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Max requests in current window |
| `X-RateLimit-Remaining` | Requests remaining |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
| `X-RateLimit-Plan` | Current tier (free/pro/business) |

### `GET /api/demo?url=<url>`

Lightweight demo endpoint for quick testing. Same output as POST /api/snap. Limited to 3 requests/day per IP.

### `GET /api/health`

Health check. Returns `{ "status": "ok" }`.

---

## Pricing Tiers (RapidAPI Mapping)

### Basic (Free)

- **Price:** $0/month
- **Requests:** 10/day (no API key required)
- **Rate limit:** 25 requests per 15-minute window
- **Features:** Full JSON extraction, tech stack detection, content extraction

### Pro

- **Price:** $19/month
- **Requests:** 10,000/month (1,000/day)
- **Rate limit:** 1,000 requests per 15-minute window, 100/min burst
- **Features:** All Basic features + higher burst limits, commercial usage

### Business (Ultra/Mega)

- **Price:** $79/month
- **Requests:** 100,000/month (10,000/day)
- **Rate limit:** 5,000 requests per 15-minute window, 1,000/min burst
- **Features:** All Pro features + highest limits, batch workflows, priority support

---

## Sample cURL

```bash
curl -X POST https://websnap-api.vercel.app/api/snap \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"url":"https://stripe.com"}'
```

## Buyer Use Cases

- Lead enrichment from company homepages before outreach
- Article/docs ingestion for AI agent context windows
- Tech stack lookup for competitive analysis
- SEO metadata extraction and QA
- Scheduled webpage monitoring in cron workflows
- Webhook-triggered parsing in data pipelines

## Caveats

- Targets must be publicly accessible (no auth-walled pages)
- Bot-protected pages may return incomplete data
- HTML extraction only — no JavaScript rendering or screenshots
