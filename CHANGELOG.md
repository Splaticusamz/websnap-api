# Changelog

## [0.1.3] - 2026-03-28

### Added
- automation-first plan definitions in `src/lib/plans.ts`
- billing helpers in `src/lib/billing.ts`
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`
- `GET /api/ops/status`
- Vercel cron config in `vercel.json`
- billing success/cancel pages
- env-based API key loading via `API_KEYS_JSON`

### Changed
- rebuilt landing page around conversion, use cases, and paid upgrade path
- rebuilt docs page around onboarding, automation, and billing flow
- updated private ops dashboard dev status to reflect current automation work
- expanded CORS headers for ops and webhook flows
- standardized plan/rate-limit logic around explicit code-level plan definitions

## [0.1.2] - 2026-03-28

### Added
- New unlinked private-ish ops dashboard at `/ops/websnap-pulse-20260328`
- Visually rich internal dashboard with system diagrams, automation flow, revenue timeline, complementary stats, and hourly development tracker
- Route metadata configured for `noindex, nofollow`

### Changed
- Removed public homepage link to the dashboard route
- Synced homepage pricing and GitHub link with current project state

## [0.1.1] - 2026-03-28

### Added
- Professional infrastructure documentation set:
  - `docs/DEPLOYMENT.md`
  - `docs/PRICING.md`
  - `docs/BILLING_SETUP.md`
  - `docs/RAPIDAPI-LISTING.md`
- Expanded root `README.md` with architecture, monetization, deployment, and repo structure
- Expanded `.env.example` with deployment and billing placeholders

### Changed
- Reframed current phase around infrastructure, packaging, and monetization prep
- Standardized documentation structure for Vercel/GitHub/marketplace readiness

## [0.1.0] - 2026-03-27

### Added
- Project scaffolding (Next.js 14, TypeScript, Tailwind)
- `POST /api/snap` endpoint
- `GET /api/health` endpoint
- Landing page
- Initial documentation structure
- Vercel deployment config
