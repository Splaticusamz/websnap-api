# WebSnap API

Turn any public webpage into structured JSON in one API call.

WebSnap API extracts titles, descriptions, Open Graph tags, Twitter cards, links, images, cleaned main content, headings, contact/social signals, JSON-LD structured data, and detected tech stack from public webpages. It is built for AI agents, workflow automation, lead enrichment, SEO tooling, and internal developer systems.

## Current Status

- Live on Vercel
- Core extraction API shipped
- Pricing and packaging in place
- Checkout + webhook + cron automation scaffolding added
- Home + docs now provide a stronger self-serve onboarding and proof-of-value path
- Landing page and docs include direct paid-plan checkout testing + fallback messaging
- Operator dashboard now reflects real billing/config readiness, provisioning mode, masked key inventory, and current-window usage visibility
- Signed stateless API key provisioning is supported for paid/manual fulfillment without a database
- Ready for direct docs-led distribution and RapidAPI submission prep

## Why this product

The simplest useful API products win when they remove annoying glue work.

WebSnap API does that by turning:

```text
URL -> HTML page -> structured JSON -> agent/tooling workflow
```

That makes it a strong fit for:
- AI agent builders
- automation developers
- outbound / enrichment workflows
- metadata and content ingestion pipelines
- homepage/contact enrichment workflows
- internal research tools

## Main Endpoints

- `POST /api/snap` — extract structured JSON from a public webpage
- `GET /api/health` — health status
- `POST /api/billing/checkout` — resolve the current checkout path for a paid plan
- `POST /api/billing/webhook` — receive billing automation events
- `POST /api/ops/provision-key` — issue a signed stateless API key for a customer
- `GET /api/ops/status` — internal ops / cron automation snapshot

## Pricing

- **Free** — $0 — 100 requests/day
- **Pro** — $19/mo — 10,000 requests/month
- **Business** — $79/mo — 100,000 requests/month

See:
- `docs/API.md`
- `docs/PRICING.md`
- `docs/BILLING_SETUP.md`
- `docs/RAPIDAPI-LISTING.md`

## Automation-First Stack

This repo now includes automation-friendly infrastructure:

- explicit plan constants in code
- checkout endpoint for paid plan flow
- webhook receiver for provisioning events
- Vercel cron config for scheduled ops checks
- ops status endpoint for internal monitoring
- masked API key inventory + recent in-memory usage snapshots for operators
- env-based API key loading for automated provisioning paths
- signed stateless API keys for fast paid/manual fulfillment

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Cheerio
- Vercel

## Repository Structure

```text
.
├── CHANGELOG.md
├── README.md
├── vercel.json
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

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Environment Configuration

Copy `.env.example` to `.env.local`.

Important variables include:
- `NEXT_PUBLIC_APP_URL`
- `API_KEYS_JSON`
- `WEBSNAP_OPS_TOKEN`
- `WEBSNAP_API_KEY_SIGNING_SECRET`
- `NEXT_PUBLIC_STRIPE_PRO_CHECKOUT_LINK`
- `NEXT_PUBLIC_STRIPE_BUSINESS_CHECKOUT_LINK`
- `STRIPE_WEBHOOK_SECRET`

## Deploy Flow

1. Push to `main`
2. Vercel deploys automatically
3. Hourly/daily cron routes can hit `/api/ops/status`
4. Billing automation can call `/api/billing/webhook`

## Current Constraints

- rate limiting and usage counters are in-memory for now
- checkout still depends on real Stripe/live account config for full self-serve billing
- no persistent database yet for usage or customers
- manual fallback is now stronger because ops can issue signed paid keys instantly
- full self-serve checkout still needs live Stripe configuration
- bot-protected targets may need future browser fallback

## Near-Term Next Moves

- wire live Stripe checkout URLs / webhook forwarding
- submit RapidAPI listing
- add persistence for usage and customer records
- capture first paid conversions and tune copy from real usage

## License

MIT
