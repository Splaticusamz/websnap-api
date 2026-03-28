# Billing Setup

## Goal

Make buying possible fast, while keeping the path ready for real automation.

## Current Billing Stack

This repo now includes:
- pricing and plan constants in code
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`
- success/cancel pages
- env placeholders for hosted checkout links, price IDs, and webhook secrets

## Recommended Setup

### Fastest path
- create hosted Stripe checkout/payment links for Pro and Business
- set:
  - `NEXT_PUBLIC_STRIPE_PRO_CHECKOUT_LINK`
  - `NEXT_PUBLIC_STRIPE_BUSINESS_CHECKOUT_LINK`
- send buyers through `POST /api/billing/checkout`
- land them on `/billing/success`
- issue API keys manually or from your provisioning script

### More automated path
- configure `STRIPE_WEBHOOK_SECRET`
- forward successful checkout/subscription events to `POST /api/billing/webhook`
- include plan metadata or use price IDs for tier mapping
- automate key provisioning from webhook output

## Required Environment Variables

### Minimum for direct paid path
- `NEXT_PUBLIC_STRIPE_PRO_CHECKOUT_LINK`
- `NEXT_PUBLIC_STRIPE_BUSINESS_CHECKOUT_LINK`
- `NEXT_PUBLIC_STRIPE_SUCCESS_URL`
- `NEXT_PUBLIC_STRIPE_CANCEL_URL`

### For webhook automation
- `STRIPE_WEBHOOK_SECRET` or `WEBSNAP_BILLING_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID`

## Plan Mapping

- Stripe Pro link/price -> WebSnap `pro`
- Stripe Business link/price -> WebSnap `business`

## Suggested Flow

1. Buyer lands on homepage/docs
2. Buyer sees example response + pricing
3. Buyer selects Pro or Business
4. Frontend or automation calls `POST /api/billing/checkout`
5. Checkout completes
6. Stripe (or forwarder) hits `POST /api/billing/webhook`
7. Provision API key for returned tier
8. Buyer starts sending `x-api-key`

## Operational Note

Manual provisioning is still acceptable if:
- checkout works
- tier mapping is obvious
- key issuance is fast
- docs clearly explain first-call setup

## What not to overbuild yet

- full customer portal
- complex seat/account systems
- perfect metered billing before real buyers exist
- deep analytics before live checkout works
