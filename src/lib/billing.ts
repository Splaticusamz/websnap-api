import { config } from "@/lib/config";
import type { Tier } from "@/lib/plans";
import { PAID_PLAN_KEYS } from "@/lib/plans";

export interface CheckoutTarget {
  type: "hosted-link" | "price-id" | "unconfigured";
  value?: string;
}

export function isPaidPlan(plan: string): plan is Tier {
  return PAID_PLAN_KEYS.includes(plan as Tier);
}

export function getCheckoutTarget(plan: Tier): CheckoutTarget {
  if (plan === "free") {
    return { type: "unconfigured" };
  }

  const hostedLink = plan === "pro" ? config.billing.proCheckoutLink : config.billing.businessCheckoutLink;
  if (hostedLink) {
    return { type: "hosted-link", value: hostedLink };
  }

  const priceId = plan === "pro" ? config.billing.proPriceId : config.billing.businessPriceId;
  if (priceId) {
    return { type: "price-id", value: priceId };
  }

  return { type: "unconfigured" };
}

export function getWebhookAuthMode() {
  if (config.billing.webhookSecret) return "shared-secret";
  return "disabled";
}

export function mapPriceIdToTier(priceId: string | undefined): Tier | null {
  if (!priceId) return null;
  if (config.billing.proPriceId && priceId === config.billing.proPriceId) return "pro";
  if (config.billing.businessPriceId && priceId === config.billing.businessPriceId) return "business";
  return null;
}
