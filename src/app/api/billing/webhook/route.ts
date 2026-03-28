import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getWebhookAuthMode, mapPriceIdToTier } from "@/lib/billing";
import { config } from "@/lib/config";

export async function POST(req: NextRequest) {
  const payloadText = await req.text();

  if (getWebhookAuthMode() === "disabled") {
    return NextResponse.json({
      ok: false,
      error: "Webhook secret is not configured",
      hint: "Set STRIPE_WEBHOOK_SECRET or WEBSNAP_BILLING_WEBHOOK_SECRET before enabling live billing automation.",
    }, { status: 503 });
  }

  const providedSecret = req.headers.get("x-websnap-webhook-secret") || "";
  if (providedSecret !== config.billing.webhookSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized webhook" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(payloadText);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const priceId = event?.data?.object?.items?.data?.[0]?.price?.id || event?.data?.object?.metadata?.priceId;
  const email = event?.data?.object?.customer_details?.email || event?.data?.object?.customer_email || null;
  const tier = mapPriceIdToTier(priceId) || event?.data?.object?.metadata?.plan || null;
  const fingerprint = createHash("sha256").update(payloadText).digest("hex").slice(0, 12);

  return NextResponse.json({
    ok: true,
    received: true,
    authMode: getWebhookAuthMode(),
    eventType: event?.type || "unknown",
    planTier: tier,
    customerEmail: email,
    fingerprint,
    nextAction: tier
      ? `Provision or upgrade API key for tier '${tier}'.`
      : "No tier mapping found. Inspect metadata / price id mapping.",
  });
}
