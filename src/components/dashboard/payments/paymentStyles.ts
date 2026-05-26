// src/components/dashboard/payments/paymentStyles.ts
//
// Single source of truth for payment visual treatment.

import type {
    PaymentMethod,
    PaymentStatus,
} from "@/src/types/payment.types";

// ─────────────────────────────────────────────────────────────────
// STATUS — semantic, brand-aligned
//   PAID     → jade  (cleared, fully landed)
//   PENDING  → coral-soft (awaiting confirmation)
//   FAILED   → coral (something went wrong, needs attention)
//   REFUNDED → ink-soft (archival)
// ─────────────────────────────────────────────────────────────────

export const paymentStatusStyles: Record<PaymentStatus, string> = {
    PAID: "bg-jade-50 text-jade-800 border-jade-100",
    PENDING: "bg-coral-50/60 text-coral-700 border-coral-100",
    FAILED: "bg-coral-50 text-coral-700 border-coral-100",
    REFUNDED: "bg-cream text-ink-soft border-rule-soft",
};

export const paymentStatusAccent: Record<PaymentStatus, string> = {
    PAID: "bg-jade-500",
    PENDING: "bg-coral-400",
    FAILED: "bg-coral-600",
    REFUNDED: "bg-ink-soft/30",
};

export function paymentStatusLabel(status: PaymentStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

// ─────────────────────────────────────────────────────────────────
// METHOD — quiet tints, all within the brand family.
// No rainbow — pink/orange/violet/sky/indigo/amber are out.
// Each method gets a label matching how Bangladeshis actually write it.
// ─────────────────────────────────────────────────────────────────

export const paymentMethodStyles: Record<PaymentMethod, string> = {
    CASH: "bg-jade-50 text-jade-800 border-jade-100",
    BKASH: "bg-coral-50 text-coral-700 border-coral-100",
    NAGAD: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    ROCKET: "bg-coral-50/60 text-coral-700 border-coral-100",
    BANK_TRANSFER: "bg-cream text-ink border-rule-soft",
    CARD: "bg-cream/80 text-ink border-rule-soft",
    CHEQUE: "bg-cream/60 text-ink-soft border-rule-soft",
    OTHER: "bg-cream text-ink-soft border-rule-soft",
};

const methodLabels: Record<PaymentMethod, string> = {
    CASH: "Cash",
    BKASH: "bKash",
    NAGAD: "Nagad",
    ROCKET: "Rocket",
    BANK_TRANSFER: "Bank Transfer",
    CARD: "Card",
    CHEQUE: "Cheque",
    OTHER: "Other",
};

export function paymentMethodLabel(method: PaymentMethod): string {
    return methodLabels[method] ?? method;
}