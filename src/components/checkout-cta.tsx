"use client";

import { useState } from "react";
import type { Tier } from "@/lib/plans";

interface CheckoutCtaProps {
  plan: Extract<Tier, "pro" | "business">;
  label: string;
  className?: string;
}

interface CheckoutResponse {
  ok?: boolean;
  checkoutUrl?: string;
  message?: string;
  nextStep?: string;
}

export function CheckoutCta({ plan, label, className }: CheckoutCtaProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await response.json()) as CheckoutResponse;

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setMessage(data.nextStep || data.message || "Checkout is not configured yet.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? "Loading checkout…" : label}
      </button>
      {message ? <p className="max-w-sm text-xs leading-5 text-amber-300">{message}</p> : null}
    </div>
  );
}
