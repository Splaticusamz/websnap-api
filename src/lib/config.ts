const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://websnap-api.vercel.app";

export const config = {
  appUrl,
  maxFetchTimeout: 10_000,
  maxContentLength: 5_000,
  maxLinks: 50,
  maxImages: 30,
  userAgent: "WebSnapBot/1.1 (+https://websnap-api.vercel.app)",
  ops: {
    token: process.env.WEBSNAP_OPS_TOKEN || "",
  },
  auth: {
    keySigningSecret: process.env.WEBSNAP_API_KEY_SIGNING_SECRET || process.env.API_KEY_SIGNING_SECRET || "",
  },
  billing: {
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || process.env.WEBSNAP_BILLING_WEBHOOK_SECRET || "",
    proPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    businessPriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || "",
    proCheckoutLink: process.env.NEXT_PUBLIC_STRIPE_PRO_CHECKOUT_LINK || "",
    businessCheckoutLink: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_CHECKOUT_LINK || "",
    successUrl: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || `${appUrl}/billing/success`,
    cancelUrl: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || `${appUrl}/billing/cancel`,
  },
} as const;
