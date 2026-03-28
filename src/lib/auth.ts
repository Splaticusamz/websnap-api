import apiKeys from "../data/api-keys.json";
import type { Tier } from "./plans";

export interface ApiKeyRecord {
  key: string;
  name: string;
  tier: Tier;
  createdAt?: string;
  enabled?: boolean;
}

export interface ApiKeyInfo {
  name: string;
  tier: Tier;
  authenticated: true;
}

function loadApiKeys(): ApiKeyRecord[] {
  const raw = process.env.API_KEYS_JSON;
  if (!raw) {
    return apiKeys as ApiKeyRecord[];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as ApiKeyRecord[];
    }
  } catch (error) {
    console.error("Failed to parse API_KEYS_JSON:", error);
  }

  return apiKeys as ApiKeyRecord[];
}

export function authenticateRequest(
  apiKey: string | null
): { authenticated: false; tier: "free" } | ApiKeyInfo {
  if (!apiKey) return { authenticated: false, tier: "free" };

  const found = loadApiKeys().find((k) => k.key === apiKey && k.enabled !== false);
  if (!found) return { authenticated: false, tier: "free" };

  return {
    authenticated: true,
    name: found.name,
    tier: found.tier,
  };
}
