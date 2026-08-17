## Why

The backend (`pmsp-server`) now supports yearly billing: `GET /subscription/plans` and `GET /subscriptions/me` return `priceYearly` alongside `priceMonthly`, and `POST /subscription-requests` accepts a required `billingCycle` (`MONTHLY` | `YEARLY`) that determines the requested amount and the resulting billing period on approval. Nothing in the client consumes any of this yet: `Pricing.tsx` only ever renders `priceMonthly`, and `RequestPaymentDialog` submits a request with no `billingCycle` field at all — which will start failing validation once the server's `billingCycle` field is required. This change wires the client up to both.

## What Changes

- Add `priceYearly: string | null` to the `Plan` type and `priceYearly: string | null` to the `Subscription` type (mirroring how `priceMonthly` is already typed as a stringified Decimal).
- Add a `BillingCycle` type (`"MONTHLY" | "YEARLY"`) and a required `billingCycle` field to `CreateSubscriptionRequestPayload`.
- `Pricing.tsx` (public landing page): add a Monthly/Yearly toggle above the plan cards. Toggling switches every card's displayed price and period label (`/mo` vs `/yr`) together; the yearly option shows a savings indicator (2 months free). The FREE card's price is unaffected by the toggle (always ৳0). The toggle's selection does not change what `/register?plan=` carries — plan selection, not billing cycle, is what registration needs (billing cycle is chosen later at actual payment time in the dialog).
- `RequestPaymentDialog.tsx`: add a Monthly/Yearly segmented control as part of "Step 1 · Send Money". Switching it updates the displayed "Send X to Y" amount and is included as `billingCycle` in the submitted request. Default to MONTHLY on open. If the plan has no `priceYearly` (yearly unavailable), do not show YEARLY as a selectable option for that plan.
- `owner/dashboard/subscription/page.tsx`: the plan picker cards (`PlanCard`) and the current-plan summary gain a way to see the yearly price where relevant — at minimum, passing the correct plan into `RequestPaymentDialog` already works; the card price display should follow the same toggle pattern as the landing page for consistency (or, if simpler, show both "৳X/mo · ৳Y/yr" without a toggle — see design.md for the decision).
- Handle the case where `priceYearly` is `null` for a plan gracefully everywhere it's read (FREE always; any paid plan an admin has cleared yearly pricing for).

## Capabilities

### New Capabilities
- `pricing-billing-cycle-display`: Defines how the client displays monthly vs. yearly pricing on the public pricing section and lets an owner choose a billing cycle when submitting a manual subscription payment request. (The pricing/amount values themselves are the backend's `subscription-plan-pricing` capability in `pmsp-server`'s openspec — this capability covers only this repo's display and selection behavior.)

### Modified Capabilities
(none — no existing capability spec in this repo covers pricing display or the payment request dialog)

## Impact

- **Types**: `src/types/subscription.types.ts` (`Plan.priceYearly`, `Subscription.priceYearly`), `src/types/subscriptionRequest.types.ts` (`BillingCycle` type, `CreateSubscriptionRequestPayload.billingCycle`).
- **Components**: `src/sections/Pricing.tsx` (monthly/yearly toggle), `src/components/dashboard/subscription/RequestPaymentDialog.tsx` (cycle selector + amount derivation), `src/app/[locale]/(dashboardLayout)/owner/dashboard/subscription/page.tsx` (plan-card price display).
- **Out of scope**: any backend change (already done in `pmsp-server`). Carrying billing cycle through the `/register?plan=` → email-verify → auto-open-payment-dialog flow (`wire-pricing-cta-to-registration`) — that flow carries a plan, not a cycle; the dialog always defaults to MONTHLY on open regardless of entry point, and the owner picks the cycle explicitly in the dialog every time.
