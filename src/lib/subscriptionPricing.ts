import type { Plan } from "@/src/types/subscription.types";
import type { BillingCycle } from "@/src/types/subscriptionRequest.types";

/**
 * Resolves the amount to display/charge for a plan under a given billing
 * cycle. Falls back to the monthly amount (with `unavailable: true`) when
 * YEARLY is requested but the plan has no `priceYearly` configured — callers
 * decide how to surface that (hide the option, fall back silently, etc.).
 */
export function getPriceForCycle(
    plan: Plan,
    cycle: BillingCycle,
): { amount: number; unavailable: boolean } {
    const monthly = parseFloat(plan.priceMonthly) || 0;

    if (cycle === "MONTHLY") {
        return { amount: monthly, unavailable: false };
    }

    if (!plan.priceYearly) {
        return { amount: monthly, unavailable: true };
    }

    return { amount: parseFloat(plan.priceYearly) || 0, unavailable: false };
}
