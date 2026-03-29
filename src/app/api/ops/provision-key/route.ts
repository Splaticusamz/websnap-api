import { NextRequest, NextResponse } from "next/server";
import { createSignedApiKey, isSignedKeyProvisioningEnabled, maskApiKey } from "@/lib/auth";
import { config } from "@/lib/config";
import { getPlan, type Tier } from "@/lib/plans";

function getOpsToken(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  return req.headers.get("x-websnap-ops-token") || "";
}

function addDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  if (!config.ops.token) {
    return NextResponse.json({ ok: false, error: "WEBSNAP_OPS_TOKEN is not configured." }, { status: 503 });
  }

  const providedToken = getOpsToken(req);
  if (!providedToken || providedToken !== config.ops.token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isSignedKeyProvisioningEnabled()) {
    return NextResponse.json({ ok: false, error: "WEBSNAP_API_KEY_SIGNING_SECRET is not configured." }, { status: 503 });
  }

  let body: {
    plan?: Tier;
    name?: string;
    email?: string;
    expiresAt?: string;
    daysValid?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const plan = body.plan;
  if (!plan || !["free", "pro", "business"].includes(plan)) {
    return NextResponse.json({ ok: false, error: "Invalid plan. Use free, pro, or business." }, { status: 400 });
  }

  const expiresAt = body.expiresAt || (typeof body.daysValid === "number" && body.daysValid > 0 ? addDays(body.daysValid) : undefined);
  const apiKey = createSignedApiKey({
    tier: plan,
    name: body.name,
    email: body.email,
    expiresAt,
  });

  const planInfo = getPlan(plan);
  const subject = (body.email || body.name || `${plan}-customer`).trim();

  return NextResponse.json({
    ok: true,
    plan,
    planName: planInfo.name,
    price: planInfo.monthlyPriceUsd === 0 ? "$0" : `$${planInfo.monthlyPriceUsd}/mo`,
    subject,
    expiresAt: expiresAt || null,
    apiKey,
    maskedKey: maskApiKey(apiKey),
    headers: {
      "x-api-key": apiKey,
    },
    exampleCurl: `curl -X POST ${config.appUrl}/api/snap \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: ${apiKey}' \
  -d '{"url":"https://example.com"}'`,
  });
}
