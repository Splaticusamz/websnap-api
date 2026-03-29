import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getOperatorSnapshot } from "@/lib/operator";

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
  const snapshot = getOperatorSnapshot();

  return NextResponse.json({
    ok: true,
    scope,
    checkedAt: new Date().toISOString(),
    automation: {
      cronConfigured: true,
      webhookMode: snapshot.webhookMode,
      provisioningMode: snapshot.provisioningMode,
      checkoutConfigured: snapshot.checkoutConfigured,
    },
    plans: snapshot.tierBreakdown,
    apiKeys: snapshot.apiKeys,
    usage: snapshot.usage,
    onboardingChecklist: snapshot.onboardingChecklist,
    appUrl: snapshot.appUrl,
  });
}
