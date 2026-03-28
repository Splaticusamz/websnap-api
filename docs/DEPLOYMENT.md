# Deployment

## Current State

WebSnap API is already linked to a Vercel project and a GitHub repository.

- Vercel project name: `websnap-api`
- Deployment model: GitHub-connected automatic deploys
- Recommended branch for production: `main`

## Deployment Flow

1. Commit infrastructure or code changes locally
2. Push to GitHub `main`
3. Vercel detects the push and starts a production build
4. Verify:
   - `/api/health`
   - homepage
   - docs page

## Local Verification

```bash
npm install
npm run build
npm run start
```

## Production Verification Checklist

- `GET /api/health` returns `status: ok`
- homepage loads without runtime errors
- docs pages render
- API route still responds for known URLs
- environment variables are set in Vercel when billing/auth features are enabled

## Environment Variables

Before enabling billing/provisioning features in production, configure:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID`
- `RAPIDAPI_PROXY_SECRET` (if marketplace path is used)
- `NEXT_PUBLIC_APP_URL`

## Notes

- Current rate limiting is memory-backed and best suited to the existing lightweight deployment phase.
- Persistent quota enforcement should move to a shared store before significant paid traffic.
- Keep deployment simple: Vercel + GitHub is the default path unless cost or scale forces a move.
