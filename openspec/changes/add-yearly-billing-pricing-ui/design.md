## Context

See proposal.md - Why for the backend state this wires up to. Relevant client-side facts:

- `Plan` (`src/types/subscription.types.ts`) and `Subscription` currently only type `priceMonthly: string` (backend returns Prisma `Decimal` as a string). The backend now also returns `priceYearly: string | null` on both `GET /subscription/plans` (`Plan`) and `GET /subscriptions/me` (`Subscription`, via the service's `priceYearly` addition).
- `Pricing.tsx` (public landing page) renders `plans.map(plan => <PlanCard plan={plan} />)`, each card reading `plan.priceMonthly` once via local `parseFloat`. No toggle/cycle state exists anywhere in this component today.
- `RequestPaymentDialog.tsx` computes `amount = parseFloat(plan.priceMonthly)` once and shows a fixed "Send X to Y" line; `handleSubmit` posts `{ targetPlan, method, senderNumber, transactionId }` — no `billingCycle`. The backend's `createSubscriptionRequestZodSchema` now requires `billingCycle`, so this dialog is currently broken against the updated backend (any submission will fail validation) until this change lands.
- `owner/dashboard/subscription/page.tsx`'s `PlanCard` (a different, dashboard-local component of the same name) also reads `plan.priceMonthly` once for its compact plan-switcher cards, and passes the selected `Plan` into `RequestPaymentDialog` via `handleSelect`.
- `usePlans()` caches with `staleTime: 5 * 60 * 1000` — pricing data itself is not expected to change within a session, so cycle-toggle state is purely local UI state, not re-fetched.

## Goals / Non-Goals

**Goals:**
- Make `RequestPaymentDialog` submit a valid request again (add the now-required `billingCycle`) — this is the functionally urgent part, since the dialog is otherwise broken against the current backend.
- Let a visitor preview yearly pricing on the landing page before ever reaching the dialog.
- Keep cycle selection state fully local/ephemeral (component `useState`) — no persistence, no URL param, no global store.

**Non-Goals:**
- Persisting or carrying a chosen billing cycle across navigation (e.g. into `/register?plan=`, or through email verification into the auto-opened dialog). The owner picks a cycle explicitly, fresh, every time the dialog opens — see proposal.md's Impact/Out-of-scope note.
- Any change to how `usePlans()`/`useSubscription()` fetch or cache data — only how the already-fetched `priceYearly` field is displayed.
- Redesigning the dashboard subscription page's overall layout — the plan-card price display there gets the minimum change needed for consistency (Decision 4), not a rebuild.

## Decisions

**1. Toggle state lives in `Pricing.tsx` itself, passed down as a prop.**
A single `const [cycle, setCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY")` in the parent component, passed to `PlanCard` as a prop, is the simplest fit — no cross-component state needed since the toggle only affects this one section's cards. Rejected: URL query param (`?cycle=`) — adds shareable-link complexity for a preview-only toggle with no other consumer.

**2. Price formatting helper: `getPriceForCycle(plan, cycle)` returns `{ amount, unavailable }`.**
Centralizes the "yearly requested but plan has no `priceYearly`" fallback (spec's "A plan has no yearly price" scenario) in one place used by both `Pricing.tsx` and the dashboard's `PlanCard`, instead of duplicating null-handling in each component. Returns the monthly amount with `unavailable: true` when yearly is requested but absent, so callers can decide how to surface it (the dialog uses `unavailable` to hide the Yearly option entirely, per Decision 3; the landing-page card falls back to showing monthly silently, since forcing a toggle-driven price to disappear on one card while others update would be visually jarring for a preview-only control).

**3. `RequestPaymentDialog`'s cycle control only offers Yearly when `plan.priceYearly` is non-null.**
Directly enforces the spec's "Plan has no yearly price available" scenario — if there's nothing to switch to, don't show a dead option. Implemented as conditionally rendering the Yearly segment/radio option, not disabling it (disabled-but-visible would invite "why can't I click this" confusion with no explanation surfaced).

**4. Dashboard subscription page's plan-picker cards show both prices statically ("৳X/mo · save with yearly"), no toggle.**
Per proposal.md's open framing, resolved here: the dashboard's compact `PlanCard` grid is a secondary surface (the primary cycle decision happens in the dialog once a plan is chosen) — adding a second independent toggle there would be redundant UI for a choice the dialog immediately asks again. Showing the monthly price as the headline (unchanged) with a small yearly-price/savings hint below it gives visibility without a second interactive control. Alternative considered: mirror the landing page's full toggle here too — rejected as unnecessary duplication for a lower-traffic, already-authenticated surface where the dialog is one click away regardless.

**5. `billingCycle` resets to `MONTHLY` every time the dialog opens, per the existing `useEffect` that already resets `method`/`senderNumber`/`transactionId` on `open`.**
Matches the spec's "Dialog reopened" scenario and the existing reset pattern already in the component (`useEffect(() => { if (open) { setMethod("BKASH"); ... } }, [open])`) — one more line in the same effect, no new pattern introduced.

## Risks / Trade-offs

- **[Risk]** A plan's `priceYearly` could be `null` while the landing-page toggle is on Yearly, and silently falling back to monthly (Decision 2) could look like a bug ("I toggled Yearly but this card still shows a monthly-looking number") → **Mitigation**: today all three paid plans have `priceYearly` set (per the backend seed), so this is a dormant edge case, not a current-state problem. If it becomes relevant (an admin clears a plan's yearly price), the fallback is silent by design for the read-only preview card; the dialog (Decision 3) is the point where unavailability becomes explicit, since that's where it actually blocks an action.
- **[Risk]** Two different components both named `PlanCard` (landing page's and dashboard's) could cause confusion when reading diffs across this change → **Mitigation**: not renaming either (out of scope, unrelated to this change's purpose) — just noting it here so it isn't mistaken for a duplicate/leftover file during review.

## Migration Plan

1. Add `priceYearly` to `Plan` and `Subscription` types; add `BillingCycle` type and `billingCycle` to `CreateSubscriptionRequestPayload`.
2. Add the shared `getPriceForCycle` helper (co-located with the subscription types or a small `lib` util — implementer's choice of exact file).
3. Wire `RequestPaymentDialog` first (functionally urgent — the dialog is broken against the current backend without this).
4. Wire `Pricing.tsx`'s toggle.
5. Update the dashboard subscription page's plan-card price display per Decision 4.
6. No backend/schema/migration involved — this is a pure client change; rollback is a plain revert.
