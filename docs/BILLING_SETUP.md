# Billing Setup

## Goal

Keep billing simple. Do not overbuild before demand exists.

## Recommended Phase-Appropriate Setup

### Phase 1
- Hosted Stripe checkout links for Pro and Business
- Manual or semi-manual API key issuance after payment
- Clear docs for how plan mapping works

### Phase 2
- Stripe webhook receives successful subscription events
- Customer is mapped to a plan
- API key is provisioned automatically
- Quotas are attached to that key

## Required Environment Variables

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_SUCCESS_URL`
- `NEXT_PUBLIC_STRIPE_CANCEL_URL`

## Plan Mapping

- Stripe Pro product/price -> WebSnap `pro`
- Stripe Business product/price -> WebSnap `business`

## Checkout Flow

1. Visitor lands on homepage/docs
2. Visitor chooses Pro or Business
3. Hosted Stripe checkout completes
4. Success page explains provisioning steps
5. API key is issued manually until automation is implemented

## Operational Note

Manual provisioning is acceptable at this stage if:
- pricing is clear
- response time to buyers is fast
- internal mapping from payment to API key tier is documented

## What not to build yet

- full customer portal SaaS
- complex usage metering dashboards
- account systems that delay launch

The current objective is to make payment possible, not to create a full billing platform.
