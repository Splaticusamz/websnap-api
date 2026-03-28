# RapidAPI Listing Draft

## Product Name

WebSnap API

## One-Line Summary

Turn any public webpage into structured JSON in one API call.

## Category Ideas

- Data
- Developer Tools
- Web Scraping
- AI Tools

## Tags

web scraping, metadata, content extraction, open graph, tech stack detection, lead enrichment, ai agents, automation, seo, url parser

## Feature Bullets

- Extract title, description, OG tags, Twitter cards, and favicon
- Pull links, images, and cleaned main content
- Detect technologies such as Next.js, React, WordPress, Shopify, Cloudflare, and more
- Return structured JSON suitable for agents and pipelines
- Lightweight API-first workflow with fast setup

## Sample Request

```bash
curl -X POST https://websnap-api.vercel.app/api/snap \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_key_here" \
  -d '{"url":"https://example.com"}'
```

## Sample Response

```json
{
  "url": "https://example.com/",
  "title": "Example Domain",
  "description": "Example website for demonstrations.",
  "canonical": "https://example.com/",
  "favicon": "https://example.com/favicon.ico",
  "ogTags": {
    "title": "Example Domain",
    "description": "Example website for demonstrations.",
    "image": null,
    "type": "website",
    "url": "https://example.com/",
    "siteName": "Example"
  },
  "twitterCard": {
    "card": null,
    "title": null,
    "description": null,
    "image": null
  },
  "links": [],
  "images": [],
  "meta": {
    "language": "en",
    "charset": "utf-8",
    "viewport": "width=device-width, initial-scale=1",
    "robots": null
  },
  "mainContent": "Example content...",
  "techStack": [
    {
      "name": "Cloudflare",
      "confidence": "high",
      "evidence": "Cloudflare headers"
    }
  ],
  "performance": {
    "fetchTimeMs": 142,
    "contentLength": 1256,
    "statusCode": 200
  }
}
```

## Pricing Copy

- Free: 100 requests/day for testing and light usage
- Pro: $19/month for 10,000 requests/month
- Business: $79/month for 100,000 requests/month

## Buyer Use Cases

- lead enrichment from company homepages
- article ingestion for agents
- tech stack lookup before outbound outreach
- metadata extraction for SEO and automation tools

## Assets to Prepare

- logo
- homepage screenshot
- docs screenshot
- example JSON screenshot
- pricing screenshot

## Caveats to Mention Clearly

- targets must be publicly accessible
- highly bot-protected pages may not work reliably without future browser fallback
- current product focus is fast HTML extraction, not full browser automation
