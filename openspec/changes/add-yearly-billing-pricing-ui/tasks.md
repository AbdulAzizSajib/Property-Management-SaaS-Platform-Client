## 1. Types

- [x] 1.1 Add `priceYearly: string | null` to `Plan` in `src/types/subscription.types.ts`
- [x] 1.2 Add `priceYearly: string | null` to `Subscription` in `src/types/subscription.types.ts`
- [x] 1.3 Add `export type BillingCycle = "MONTHLY" | "YEARLY";` to `src/types/subscriptionRequest.types.ts`
- [x] 1.4 Add `billingCycle: BillingCycle` to `CreateSubscriptionRequestPayload` in `src/types/subscriptionRequest.types.ts`

## 2. Shared pricing helper

- [x] 2.1 Add a `getPriceForCycle(plan: Plan, cycle: BillingCycle): { amount: number; unavailable: boolean }` helper — returns the parsed yearly amount when available; when `cycle === "YEARLY"` and `plan.priceYearly` is null, returns the monthly amount with `unavailable: true`; always returns `unavailable: false` for `cycle === "MONTHLY"` (place it wherever the project's existing small pricing utilities live, e.g. alongside the `fmt`/`price` helpers already duplicated in `Pricing.tsx` and `RequestPaymentDialog.tsx`, or a shared `lib` util if one is more consistent with project conventions)

## 3. Payment request dialog (`RequestPaymentDialog.tsx`) — functionally urgent

- [x] 3.1 Add `const [cycle, setCycle] = useState<BillingCycle>("MONTHLY")` and reset it to `"MONTHLY"` in the existing `useEffect` that resets `method`/`senderNumber`/`transactionId` on `open`
- [x] 3.2 Compute the displayed amount via `getPriceForCycle(plan, cycle)` instead of the current fixed `parseFloat(plan.priceMonthly)`
- [x] 3.3 Add a Monthly/Yearly segmented control (or radio group) near "Step 1 · Send Money", visually consistent with the dialog's existing form primitives (`Field`, `Select`, etc.)
- [x] 3.4 Only render/offer the Yearly option when `plan.priceYearly` is non-null (per design Decision 3) — Monthly-only when yearly is unavailable for that plan
- [x] 3.5 Include `billingCycle: cycle` in the payload passed to `mutation.mutate(...)` in `handleSubmit`

## 4. Public pricing section (`Pricing.tsx`)

- [x] 4.1 Add `const [cycle, setCycle] = useState<BillingCycle>("MONTHLY")` in the `Pricing` component
- [x] 4.2 Add a Monthly/Yearly toggle control above the plan-card grid (below `SectionHead`), showing a savings indicator for Yearly (e.g. "2 months free" / "-17%")
- [x] 4.3 Pass `cycle` down to `PlanCard`; compute displayed amount via `getPriceForCycle(plan, cycle)` instead of the current fixed `parseFloat(plan.priceMonthly)`
- [x] 4.4 Update the period label next to the price (`/mo` vs `/yr`) to match the selected cycle; keep FREE always showing ৳0 regardless of cycle
- [x] 4.5 Confirm `handleSelect`'s navigation (`/register?plan=${plan.plan}`) is unchanged by the toggle — no cycle param added (per spec's "Plan selection CTA is unaffected by the toggle")

## 5. Dashboard subscription page (`owner/dashboard/subscription/page.tsx`)

- [x] 5.1 In the page's own `PlanCard`, show the yearly price/savings as a small secondary line under the existing monthly headline price (static display, no toggle — per design Decision 4), using `getPriceForCycle(plan, "YEARLY")` and skipping the line entirely when `unavailable` is true
- [x] 5.2 In the "Current plan summary" card (the top section showing the owner's active plan, separate from the plan-picker cards below), show the yearly price for the current plan as a small secondary line under the monthly price, using `currentPlanMeta.priceYearly` — same pattern as 5.1, found missing during manual review

## 6. Verification

- [x] 6.1 Run the project's typecheck (e.g. `tsc --noEmit` or `next build` type-checking) to confirm no type errors across all touched files
- [ ] 6.2 Manually verify: landing page toggle switches all paid plan cards between monthly/yearly prices together; FREE always shows ৳0
- [ ] 6.3 Manually verify: clicking a plan CTA while Yearly is toggled still navigates to `/register?plan=<PLAN>` with no cycle param
- [ ] 6.4 Manually verify: `RequestPaymentDialog` opens with Monthly selected by default and the correct monthly amount shown
- [ ] 6.5 Manually verify: switching the dialog to Yearly updates the displayed amount and successfully submits a request with `billingCycle: "YEARLY"` (confirm against the backend — request's `amount` should equal the plan's yearly price)
- [ ] 6.6 Manually verify: submitting with Monthly selected still works end-to-end against the now-required backend `billingCycle` field (this was broken before this change — confirm it's fixed)
- [ ] 6.7 Manually verify: reopening the dialog (including via the `?openPayment=<PLAN>` auto-open flow) always resets to Monthly, regardless of what was previously selected
- [ ] 6.8 Manually verify: dashboard subscription page's plan cards show a yearly price/savings hint under each paid plan's monthly price
