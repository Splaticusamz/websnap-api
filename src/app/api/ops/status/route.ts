import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getWebhookAuthMode } from "@/lib/billing";
import { getPlanEntries } from "@/lib/plans";

function isAuthorized(req: NextRequest) {
  const token = config.ops.token;
  if (!token) {
    const source = req.nextUrl.searchParams.get("source");
    return source === "vercel-cron";
  }

  const header = req.headers.get("authorization") || "";
  return header === `Bearer ${token}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const scope = req.nextUrl.searchParams.get("scope") || "manual";
  const plans = getPlanEntries().map((plan) => ({
    tier: plan.key,
    monthlyPriceUsd: plan.monthlyPriceUsd,
    monthlyRequests: plan.monthlyRequests,
    requestsPerWindow: plan.requestsPerWindow,
    burstPerMinute: plan.burstPerMinute,
  }));

  return NextResponse.json({
    ok: true,
    scope,
    checkedAt: new Date().toISOString(),
    automation: {
      cronConfigured: true,
      webhookMode: getWebhookAuthMode(),
      checkoutConfigured: {
        pro: Boolean(config.billing.proCheckoutLink || config.billing.proPriceId),
        business: Boolean(config.billing.businessCheckoutLink || config.billing.businessPriceId),
      },
    },
    plans,
    appUrl: config.appUrl,
  });
}
