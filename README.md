# 🌐 WebSnap API

**URL → Structured JSON in one API call.**

Extract titles, descriptions, OG tags, content, links, images, and tech stack from any URL. Built for AI agents and developers who need fast, reliable web data extraction.

## Architecture

```
Client → POST /api/snap { url } → Next.js API Route → Cheerio Parse → Structured JSON
```

- **Runtime:** Next.js 14 (App Router) on Vercel Edge
- **Parsing:** Cheerio (server-side HTML parsing)
- **Auth:** API key via `x-api-key` header
- **Rate Limiting:** In-memory → Vercel KV (planned)

## API

### `POST /api/snap`

**Request:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "title": "Example Domain",
  "description": "...",
  "ogTags": { "og:title": "...", "og:image": "..." },
  "favicon": "https://example.com/favicon.ico",
  "mainContent": "cleaned text extract...",
  "links": ["..."],
  "images": ["..."],
  "techStack": ["Next.js", "React", "Vercel"],
  "performance": { "responseTimeMs": 234, "contentSizeBytes": 15420 }
}
```

### `GET /api/health`

Returns service status and version.

## Revenue Model

| Tier | Price | Requests/day |
|------|-------|-------------|
| Free | $0 | 100 |
| Pro | $9/mo | 10,000 |
| Enterprise | $49/mo | 100,000 |

Distribution channels:
- **RapidAPI Marketplace** (freemium listing)
- **Direct API keys** (Stripe metered billing)

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deployment

Deployed on Vercel. Push to `main` triggers auto-deploy.

## License

MIT
