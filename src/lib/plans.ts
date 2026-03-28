export type Tier = "free" | "pro" | "business";

export interface PlanDefinition {
  key: Tier;
  name: string;
  monthlyPriceUsd: number;
  requestWindowLabel: string;
  requestsPerWindow: number;
  windowMs: number;
  monthlyRequests: number;
  dailyRequests: number;
  burstPerMinute: number;
  features: string[];
  cta: string;
}

export const PLAN_DEFINITIONS: Record<Tier, PlanDefinition> = {
  free: {
    key: "free",
    name: "Free",
    monthlyPriceUsd: 0,
    requestWindowLabel: "15 min",
    requestsPerWindow: 25,
    windowMs: 15 * 60 * 1000,
    monthlyRequests: 3_000,
    dailyRequests: 100,
    burstPerMinute: 10,
    features: [
      "100 requests/day",
      "Structured JSON extraction",
      "Tech stack detection",
      "Public docs + test workflow",
    ],
    cta: "Start free",
  },
  pro: {
    key: "pro",
    name: "Pro",
    monthlyPriceUsd: 19,
    requestWindowLabel: "15 min",
    requestsPerWindow: 1_000,
    windowMs: 15 * 60 * 1000,
    monthlyRequests: 10_000,
    dailyRequests: 1_000,
    burstPerMinute: 100,
    features: [
      "10,000 requests/month",
      "Higher burst limits",
      "Commercial/internal-tool usage",
      "Priority support + faster key issuance",
    ],
    cta: "Get Pro",
  },
  business: {
    key: "business",
    name: "Business",
    monthlyPriceUsd: 79,
    requestWindowLabel: "15 min",
    requestsPerWindow: 5_000,
    windowMs: 15 * 60 * 1000,
    monthlyRequests: 100_000,
    dailyRequests: 10_000,
    burstPerMinute: 1_000,
    features: [
      "100,000 requests/month",
      "Highest limits",
      "Batch/commercial workflows",
      "Priority support and onboarding",
    ],
    cta: "Get Business",
  },
};

export const PAID_PLAN_KEYS: Tier[] = ["pro", "business"];

export function getPlan(plan: Tier): PlanDefinition {
  return PLAN_DEFINITIONS[plan];
}

export function getPlanEntries(): PlanDefinition[] {
  return [PLAN_DEFINITIONS.free, PLAN_DEFINITIONS.pro, PLAN_DEFINITIONS.business];
}

export function formatPlanPrice(plan: Tier): string {
  const monthlyPriceUsd = PLAN_DEFINITIONS[plan].monthlyPriceUsd;
  return monthlyPriceUsd === 0 ? "$0" : `$${monthlyPriceUsd}/mo`;
}
