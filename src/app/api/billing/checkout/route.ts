import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getCheckoutTarget, isPaidPlan } from "@/lib/billing";
import { formatPlanPrice, getPlan } from "@/lib/plans";

export async function POST(req: NextRequest) {
  let body: { plan?: string; email?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const plan = body.plan;
  const email = body.email;
  if (!plan || !isPaidPlan(plan)) {
    return NextResponse.json({ error: "Invalid plan. Use 'pro' or 'business'." }, { status: 400 });
  }

  const planInfo = getPlan(plan);
  const target = getCheckoutTarget(plan);

  if (target.type === "hosted-link" && target.value) {
    return NextResponse.json({
      ok: true,
      mode: "redirect",
      checkoutUrl: target.value,
      plan,
      price: formatPlanPrice(plan),
    });
  }

  if (target.type === "price-id" && target.value) {
    return NextResponse.json({
      ok: false,
      mode: "stripe-price-configured",
      plan,
      priceId: target.value,
      message: "Stripe price ID is configured, but hosted checkout session creation is not enabled in this deployment yet.",
      successUrl: config.billing.successUrl,
      cancelUrl: config.billing.cancelUrl,
    }, { status: 503 });
  }

  return NextResponse.json({
    ok: false,
    mode: "manual-fallback",
    plan,
    price: formatPlanPrice(plan),
    message: "Checkout is not configured yet for this plan. Payment can be handled manually while preserving plan mapping and provisioning steps.",
    nextStep: `Collect payment for ${planInfo.name} (${formatPlanPrice(plan)}) and issue a ${plan} API key.`,
    email,
  }, { status: 503 });
}
