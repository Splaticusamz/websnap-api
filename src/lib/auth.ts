import { createHmac } from "crypto";
import apiKeys from "../data/api-keys.json";
import { config } from "./config";
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
  source?: "seeded" | "signed";
  expiresAt?: string | null;
}

interface SignedApiKeyPayload {
  v: 1;
  type: "api_key";
  tier: Tier;
  sub: string;
  iat: string;
  exp?: string;
}

function toBase64Url(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(encodedPayload: string) {
  return createHmac("sha256", config.auth.keySigningSecret).update(encodedPayload).digest("base64url");
}

export function isSignedKeyProvisioningEnabled() {
  return Boolean(config.auth.keySigningSecret);
}

export function createSignedApiKey({
  tier,
  name,
  email,
  expiresAt,
}: {
  tier: Tier;
  name?: string;
  email?: string;
  expiresAt?: string;
}) {
  if (!config.auth.keySigningSecret) {
    throw new Error("WEBSNAP_API_KEY_SIGNING_SECRET is not configured");
  }

  const subject = (email || name || `${tier}-customer`).trim();
  const payload: SignedApiKeyPayload = {
    v: 1,
    type: "api_key",
    tier,
    sub: subject.slice(0, 120),
    iat: new Date().toISOString(),
    ...(expiresAt ? { exp: expiresAt } : {}),
  };

  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `wsnap_${encoded}.${signature}`;
}

export function verifySignedApiKey(apiKey: string): ApiKeyInfo | null {
  if (!config.auth.keySigningSecret || !apiKey.startsWith("wsnap_")) {
    return null;
  }

  const token = apiKey.slice("wsnap_".length);
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  if (providedSignature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SignedApiKeyPayload;
    if (payload.v !== 1 || payload.type !== "api_key" || !payload.tier || !payload.sub) {
      return null;
    }

    if (payload.exp && Date.parse(payload.exp) <= Date.now()) {
      return null;
    }

    return {
      authenticated: true,
      name: payload.sub,
      tier: payload.tier,
      source: "signed",
      expiresAt: payload.exp ?? null,
    };
  } catch {
    return null;
  }
}

export function maskApiKey(key: string) {
  return `${key.slice(0, 5)}…${key.slice(-4)}`;
}

export function loadApiKeys(): ApiKeyRecord[] {
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

export interface ApiKeyInventoryItem {
  rawKey: string;
  maskedKey: string;
  name: string;
  tier: Tier;
  createdAt?: string;
  enabled: boolean;
}

export function getApiKeyInventory(): ApiKeyInventoryItem[] {
  return loadApiKeys().map((record) => ({
    rawKey: record.key,
    maskedKey: maskApiKey(record.key),
    name: record.name,
    tier: record.tier,
    createdAt: record.createdAt,
    enabled: record.enabled !== false,
  }));
}

export function authenticateRequest(
  apiKey: string | null
): { authenticated: false; tier: "free" } | ApiKeyInfo {
  if (!apiKey) return { authenticated: false, tier: "free" };

  const found = loadApiKeys().find((k) => k.key === apiKey && k.enabled !== false);
  if (found) {
    return {
      authenticated: true,
      name: found.name,
      tier: found.tier,
      source: "seeded",
    };
  }

  return verifySignedApiKey(apiKey) ?? { authenticated: false, tier: "free" };
}
