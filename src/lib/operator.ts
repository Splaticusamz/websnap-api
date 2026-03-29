import { getApiKeyInventory, isSignedKeyProvisioningEnabled } from "@/lib/auth";
import { config } from "@/lib/config";
import { getRateLimitSnapshot } from "@/lib/rate-limit";
import { getPlanEntries } from "@/lib/plans";

function maskSubject(subject: string) {
  if (subject.startsWith("key:")) {
    const raw = subject.slice(4);
    return `${raw.slice(0, 4)}…${raw.slice(-4)}`;
  }

  if (subject.startsWith("ip:")) {
    const raw = subject.slice(3);
    return raw.length > 6 ? `${raw.slice(0, 3)}…${raw.slice(-3)}` : raw;
  }

  return subject;
}

export function getOperatorSnapshot() {
  const plans = getPlanEntries();
  const keys = getApiKeyInventory();
  const usage = getRateLimitSnapshot();

  const usageBySubject = usage.map((entry) => {
    const matchingKey = entry.subject.startsWith("key:")
      ? keys.find((key) => key.rawKey === entry.subject.slice(4))
      : null;

    return {
      subject: entry.subject,
      maskedSubject: matchingKey ? matchingKey.maskedKey : maskSubject(entry.subject),
      type: entry.subject.startsWith("key:") ? "api-key" : "ip",
      label: matchingKey?.name ?? (entry.subject.startsWith("key:") ? "Unknown API key" : "Anonymous traffic"),
      tier: matchingKey?.tier ?? entry.tier,
      windowRequests: entry.requestCount,
      windowLimit: entry.limit,
      remaining: entry.remaining,
      utilizationPct: Math.min(100, Math.round((entry.requestCount / entry.limit) * 100)),
      resetAt: new Date(entry.resetMs).toISOString(),
      recent: entry.lastRequestAt ? new Date(entry.lastRequestAt).toISOString() : null,
    };
  }).sort((a, b) => b.windowRequests - a.windowRequests);

  const tierBreakdown = plans.map((plan) => ({
    tier: plan.key,
    name: plan.name,
    price: plan.monthlyPriceUsd,
    monthlyRequests: plan.monthlyRequests,
    enabledKeys: keys.filter((key) => key.enabled && key.tier === plan.key).length,
    activeSubjects: usageBySubject.filter((entry) => entry.tier === plan.key).length,
  }));

  return {
    generatedAt: new Date().toISOString(),
    appUrl: config.appUrl,
    checkoutConfigured: {
      pro: Boolean(config.billing.proCheckoutLink || config.billing.proPriceId),
      business: Boolean(config.billing.businessCheckoutLink || config.billing.businessPriceId),
    },
    webhookMode: config.billing.webhookSecret ? "shared-secret" : "disabled",
    provisioningMode: isSignedKeyProvisioningEnabled() ? "signed-stateless" : "disabled",
    apiKeys: {
      total: keys.length,
      enabled: keys.filter((key) => key.enabled).length,
      inventory: keys.map(({ rawKey, ...rest }) => rest),
    },
    usage: {
      activeSubjects: usageBySubject.length,
      entries: usageBySubject,
    },
    tierBreakdown,
    onboardingChecklist: [
      {
        label: "Public docs and live try-it flow",
        status: "done",
      },
      {
        label: "Hosted checkout links or Stripe price IDs configured",
        status: config.billing.proCheckoutLink || config.billing.proPriceId ? "done" : "needs-config",
      },
      {
        label: "Business checkout configured",
        status: config.billing.businessCheckoutLink || config.billing.businessPriceId ? "done" : "needs-config",
      },
      {
        label: "Billing webhook secret configured",
        status: config.billing.webhookSecret ? "done" : "needs-config",
      },
      {
        label: "Stateless signed key provisioning configured",
        status: isSignedKeyProvisioningEnabled() ? "done" : "needs-config",
      },
      {
        label: "At least one enabled paid API key seeded",
        status: keys.some((key) => key.enabled && key.tier !== "free") ? "done" : "needs-config",
      },
    ],
  };
}
