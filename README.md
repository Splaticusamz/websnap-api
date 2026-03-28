# WebSnap API

URL → structured JSON in one API call.

WebSnap API extracts titles, descriptions, Open Graph tags, Twitter cards, links, images, content, and detected tech stack from public webpages. It is positioned as a lightweight API product for AI agents, workflow builders, lead-enrichment tools, and internal automation.

## Status

- Project: live and deployed
- Framework: Next.js 14 + TypeScript
- Deployment target: Vercel
- Source control: Git + GitHub
- Current phase: infrastructure / packaging / monetization prep

## Architecture

```text
Client
  -> POST /api/snap
  -> Next.js route handler
  -> fetch target URL
  -> Cheerio parse + extraction
  -> structured JSON response
```

Core pieces:
- `src/app/api/snap/route.ts` — API entrypoint
- `src/app/api/health/route.ts` — health endpoint
- `src/lib/auth.ts` — API key lookup
- `src/lib/rate-limit.ts` — in-memory rate limiting
- `src/lib/content-extract.ts` — main content extraction
- `src/lib/tech-detect.ts` — technology detection heuristics

## Revenue Model

### Target buyers
- AI agent builders
- workflow automation developers
- lead-enrichment/data-enrichment tools
- internal tools teams turning webpages into JSON

### Planned tiers
- **Free** — 100 requests/day, public docs, basic use
- **Pro** — $19/mo, 10,000 requests/month, higher limits
- **Business** — $79/mo, 100,000 requests/month, priority support/commercial use

### Distribution paths
- Direct docs-led acquisition
- Hosted checkout via Stripe
- Marketplace listing via RapidAPI

See also:
- `docs/PRICING.md`
- `docs/BILLING_SETUP.md`
- `docs/RAPIDAPI-LISTING.md`

## Repository Structure

```text
.
├── CHANGELOG.md
├── README.md
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── BILLING_SETUP.md
│   ├── DEPLOYMENT.md
│   ├── PRICING.md
│   └── RAPIDAPI-LISTING.md
├── src/
│   ├── app/
│   ├── data/
│   └── lib/
└── .env.example
```

## Local Development

```bash
npm install
npm run dev
```

App will start on `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deployment

This repo is already linked to Vercel.

Typical flow:
1. Push to `main`
2. Vercel builds automatically
3. Production deploy updates

Deployment notes live in `docs/DEPLOYMENT.md`.

## Environment Configuration

Copy `.env.example` to `.env.local` for local work.

Current env scaffolding covers:
- API service metadata
- rate-limit configuration placeholders
- Stripe placeholders
- RapidAPI placeholders
- Vercel app URL

## Current Constraints

- Rate limiting is currently in-memory, not persistent
- Billing automation is not yet enforced end-to-end
- API key provisioning is still partially manual
- Marketplace distribution is prepared but not yet submitted

## Near-Term Infrastructure Goals

- keep docs and pricing consistent
- preserve Vercel-ready deploy path
- prepare Stripe and RapidAPI config without overbuilding
- maintain professional repo structure before feature expansion

## License

MIT
