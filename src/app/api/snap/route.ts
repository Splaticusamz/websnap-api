import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { config } from "@/lib/config";
import { authenticateRequest } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkFreeTierLimit } from "@/lib/free-rate-limit";
import { detectTechStack } from "@/lib/tech-detect";
import { extractMainContent } from "@/lib/content-extract";

interface SnapOptions {
  includeContent?: boolean;
  includeTechStack?: boolean;
  includePerformance?: boolean;
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function resolveUrl(base: string, relative: string | undefined): string {
  if (!relative) return "";
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

function parseJsonLdBlocks($: cheerio.CheerioAPI) {
  const blocks: unknown[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        blocks.push(...parsed);
      } else {
        blocks.push(parsed);
      }
    } catch {
      blocks.push({ raw });
    }
  });

  return blocks.slice(0, 10);
}

function extractHeadings($: cheerio.CheerioAPI) {
  const sections = {
    h1: [] as string[],
    h2: [] as string[],
    h3: [] as string[],
  };

  (["h1", "h2", "h3"] as const).forEach((tag) => {
    $(tag).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text && sections[tag].length < 12) {
        sections[tag].push(text.slice(0, 220));
      }
    });
  });

  return sections;
}

function extractContactSignals($: cheerio.CheerioAPI, url: string) {
  const emails = new Set<string>();
  const phones = new Set<string>();
  const socialProfiles: { platform: string; url: string }[] = [];
  const seenSocial = new Set<string>();

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (!href) return;

    if (href.startsWith('mailto:')) {
      const value = href.slice('mailto:'.length).split('?')[0].trim();
      if (value) emails.add(value.toLowerCase());
      return;
    }

    if (href.startsWith('tel:')) {
      const value = href.slice('tel:'.length).trim();
      if (value) phones.add(value);
      return;
    }

    const absolute = resolveUrl(url, href);
    const patterns: [string, RegExp][] = [
      ['linkedin', /linkedin\.com/i],
      ['x', /(^|\.)x\.com/i],
      ['twitter', /twitter\.com/i],
      ['github', /github\.com/i],
      ['facebook', /facebook\.com/i],
      ['instagram', /instagram\.com/i],
      ['youtube', /youtube\.com|youtu\.be/i],
      ['tiktok', /tiktok\.com/i],
    ];

    for (const [platform, pattern] of patterns) {
      if (pattern.test(absolute) && !seenSocial.has(`${platform}:${absolute}`)) {
        seenSocial.add(`${platform}:${absolute}`);
        socialProfiles.push({ platform, url: absolute });
        break;
      }
    }
  });

  return {
    emails: Array.from(emails).slice(0, 10),
    phones: Array.from(phones).slice(0, 10),
    socialProfiles: socialProfiles.slice(0, 20),
  };
}

export async function POST(req: NextRequest) {
  try {
    // Auth
    const apiKey = req.headers.get("x-api-key");
    const authResult = authenticateRequest(apiKey);
    const clientIP = getClientIP(req);

    // For unauthenticated requests, enforce 10 requests/day per IP
    let freeTierRemaining = -1;
    if (!authResult.authenticated) {
      const ipLimit = checkFreeTierLimit(clientIP);
      freeTierRemaining = ipLimit.remaining;
      if (!ipLimit.allowed) {
        return NextResponse.json(
          {
            error: "Free tier daily limit exceeded (10 requests/day)",
            upgrade: "https://websnap-api.vercel.app/#pricing",
            retryAfterMs: ipLimit.resetMs - Date.now(),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": "10",
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(Math.ceil(ipLimit.resetMs / 1000)),
              "X-RateLimit-Plan": "free",
            },
          }
        );
      }
    }

    // Per-window rate limit (burst protection for authenticated users)
    const rlKey = authResult.authenticated ? `key:${apiKey}` : `ip:${clientIP}`;
    const rl = checkRateLimit(rlKey, authResult.tier);

    if (!rl.allowed) {
      const body: Record<string, unknown> = {
        error: "Rate limit exceeded",
        retryAfterMs: rl.resetMs - Date.now(),
      };
      if (!authResult.authenticated) {
        body.upgrade = "https://websnap-api.vercel.app/#pricing";
      }
      return NextResponse.json(body, { status: 429, headers: rl.headers });
    }

    // For free tier, override the remaining header with daily IP limit info
    if (!authResult.authenticated && freeTierRemaining >= 0) {
      rl.headers["X-RateLimit-Remaining"] = String(freeTierRemaining);
    }

    // Parse body
    let body: { url?: string; options?: SnapOptions };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: rl.headers });
    }

    const { url, options = {} } = body;
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing required field: url" }, { status: 400, headers: rl.headers });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL. Must be http or https." }, { status: 400, headers: rl.headers });
    }

    // Fetch
    const fetchStart = Date.now();
    let response: Response;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.maxFetchTimeout);
      response = await fetch(url, {
        headers: {
          "User-Agent": config.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeout);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Fetch failed";
      const isTimeout = message.includes("abort");
      return NextResponse.json(
        { error: isTimeout ? "Request timed out" : `Failed to fetch URL: ${message}` },
        { status: isTimeout ? 504 : 502, headers: rl.headers }
      );
    }

    const fetchTimeMs = Date.now() - fetchStart;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json(
        { error: `Non-HTML content type: ${contentType}` },
        { status: 422, headers: rl.headers }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Collect response headers as plain object
    const respHeaders: Record<string, string> = {};
    response.headers.forEach((v, k) => { respHeaders[k.toLowerCase()] = v; });

    // === Extract data ===

    // Basic meta
    const title = $("title").first().text().trim() || null;
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      null;
    const canonical =
      $('link[rel="canonical"]').attr("href") || parsedUrl.href;
    const favicon = resolveUrl(
      url,
      $('link[rel="icon"]').attr("href") ??
        $('link[rel="shortcut icon"]').attr("href") ??
        "/favicon.ico"
    );

    // OG Tags
    const ogTags = {
      title: $('meta[property="og:title"]').attr("content") || null,
      description: $('meta[property="og:description"]').attr("content") || null,
      image: $('meta[property="og:image"]').attr("content") || null,
      type: $('meta[property="og:type"]').attr("content") || null,
      url: $('meta[property="og:url"]').attr("content") || null,
      siteName: $('meta[property="og:site_name"]').attr("content") || null,
    };

    // Twitter Card
    const twitterCard = {
      card: $('meta[name="twitter:card"]').attr("content") || null,
      title: $('meta[name="twitter:title"]').attr("content") || null,
      description: $('meta[name="twitter:description"]').attr("content") || null,
      image: $('meta[name="twitter:image"]').attr("content") || null,
    };

    // Links
    const links: { href: string; text: string; isExternal: boolean }[] = [];
    $("a[href]").each((_, el) => {
      if (links.length >= config.maxLinks) return false;
      const href = resolveUrl(url, $(el).attr("href"));
      if (!href || href.startsWith("javascript:") || href.startsWith("#")) return;
      let isExternal = false;
      try { isExternal = new URL(href).hostname !== parsedUrl.hostname; } catch {}
      links.push({ href, text: $(el).text().trim().slice(0, 200), isExternal });
    });

    // Images
    const images: { src: string; alt: string; width?: string; height?: string }[] = [];
    $("img[src]").each((_, el) => {
      if (images.length >= config.maxImages) return false;
      const src = resolveUrl(url, $(el).attr("src"));
      if (!src) return;
      const img: { src: string; alt: string; width?: string; height?: string } = {
        src,
        alt: $(el).attr("alt") ?? "",
      };
      const w = $(el).attr("width");
      const h = $(el).attr("height");
      if (w) img.width = w;
      if (h) img.height = h;
      images.push(img);
    });

    // Meta
    const meta = {
      language: $("html").attr("lang") || null,
      charset: $('meta[charset]').attr("charset") || $('meta[http-equiv="Content-Type"]').attr("content")?.match(/charset=([^\s;]+)/)?.[1] || null,
      viewport: $('meta[name="viewport"]').attr("content") || null,
      robots: $('meta[name="robots"]').attr("content") || null,
    };

    const headings = extractHeadings($);
    const contact = extractContactSignals($, url);
    const structuredData = parseJsonLdBlocks($);

    // Build response
    const result: Record<string, unknown> = {
      url: parsedUrl.href,
      title,
      description,
      canonical,
      favicon,
      ogTags,
      twitterCard,
      links,
      images,
      meta,
      headings,
      contact,
      structuredData,
    };

    // Optional: content
    if (options.includeContent !== false) {
      result.mainContent = extractMainContent($);
    }

    // Optional: tech stack
    if (options.includeTechStack !== false) {
      result.techStack = detectTechStack($, html, respHeaders);
    }

    // Optional: performance
    if (options.includePerformance !== false) {
      result.performance = {
        fetchTimeMs,
        contentLength: html.length,
        statusCode: response.status,
      };
    }

    return NextResponse.json(result, { headers: rl.headers });
  } catch (err: unknown) {
    console.error("Snap error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/snap",
    body: { url: "string (required)", options: "{ includeContent?, includeTechStack?, includePerformance? }" },
    description: "Submit a URL to receive structured JSON extraction.",
    docs: "/docs",
  });
}
