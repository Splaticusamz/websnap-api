import { NextRequest, NextResponse } from "next/server";
import { checkDemoLimit } from "@/lib/free-rate-limit";

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * GET /api/demo?url=https://example.com
 * Lightweight demo endpoint for the landing page "Try it" feature.
 * Rate limited to 3 requests/day per IP.
 * Returns the same JSON as POST /api/snap (calls it internally).
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing ?url= query parameter" }, { status: 400 });
  }

  // Validate URL
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad proto");
  } catch {
    return NextResponse.json({ error: "Invalid URL. Must be http or https." }, { status: 400 });
  }

  // Rate limit: 3/day per IP
  const ip = getClientIP(req);
  const limit = checkDemoLimit(ip);
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": "3",
    "X-RateLimit-Remaining": String(limit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(limit.resetMs / 1000)),
  };

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Demo limit exceeded (3 per day). Get an API key for more.",
        upgrade: "https://websnap-api.vercel.app/#pricing",
      },
      { status: 429, headers }
    );
  }

  // Forward to the snap endpoint internally
  const origin = req.nextUrl.origin;
  try {
    const snapRes = await fetch(`${origin}/api/snap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({
        url,
        options: { includeContent: true, includeTechStack: true, includePerformance: true },
      }),
    });

    const data = await snapRes.json();
    return NextResponse.json(data, { status: snapRes.status, headers });
  } catch (err) {
    console.error("Demo proxy error:", err);
    return NextResponse.json({ error: "Failed to process demo request" }, { status: 500, headers });
  }
}
