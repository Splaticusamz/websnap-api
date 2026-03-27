# Architecture

## Overview

WebSnap API is a serverless web data extraction service.

```
┌─────────┐     ┌──────────────┐     ┌─────────┐
│  Client  │────▶│ Vercel Edge  │────▶│ Target  │
│ (Agent)  │◀────│ Next.js API  │◀────│  URL    │
└─────────┘     └──────────────┘     └─────────┘
                       │
                 ┌─────┴─────┐
                 │  Cheerio   │
                 │  Parser    │
                 └───────────┘
```

## Components

1. **API Route** (`/api/snap`) — Request validation, auth, rate limiting
2. **Fetcher** — HTTP client with timeout, redirect following, User-Agent rotation
3. **Parser** — Cheerio-based HTML parsing and data extraction
4. **Tech Detector** — Header/meta/script analysis for stack detection

## Data Flow

1. Validate request + check API key
2. Fetch target URL (5s timeout)
3. Parse HTML with Cheerio
4. Extract structured fields
5. Detect tech stack
6. Return JSON response

## Future

- Redis/Vercel KV for rate limits and caching
- Puppeteer fallback for JS-rendered pages
- Batch endpoint for multiple URLs
