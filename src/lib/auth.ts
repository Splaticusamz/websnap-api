import apiKeys from "../data/api-keys.json";
import type { Tier } from "./rate-limit";

export interface ApiKeyInfo {
  name: string;
  tier: Tier;
  authenticated: true;
}

export function authenticateRequest(
  apiKey: string | null
): { authenticated: false; tier: "free" } | ApiKeyInfo {
  if (!apiKey) return { authenticated: false, tier: "free" };

  const found = apiKeys.find((k) => k.key === apiKey && k.enabled);
  if (!found) return { authenticated: false, tier: "free" };

  return {
    authenticated: true,
    name: found.name,
    tier: found.tier as Tier,
  };
}
