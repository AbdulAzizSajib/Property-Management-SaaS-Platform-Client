// src/components/dashboard/invoices/invoiceStyles.ts
//
// Single source of truth for invoice visual treatment.
// Used by the invoices list, detail page, and embedded invoice lists
// (lease detail, tenant detail).

import type { InvoiceStatus, InvoiceType } from "@/src/types/invoice.types";

// ─────────────────────────────────────────────────────────────────
// STATUS — semantic, brand-aligned:
//   PAID     → jade  (resolved, money received)
//   DUE      → coral (open, needs collection)
//   PARTIAL  → coral-soft (in-progress)
//   OVERDUE  → coral (open + late)
//   CANCELED → ink-soft (archival, voided)
// ─────────────────────────────────────────────────────────────────

export const invoiceStatusStyles: Record<InvoiceStatus, string> = {
    PAID: "bg-jade-50 text-jade-800 border-jade-100",
    DUE: "bg-coral-50 text-coral-700 border-coral-100",
    PARTIAL: "bg-coral-50/60 text-coral-700 border-coral-100",
    OVERDUE: "bg-coral-50 text-coral-700 border-coral-100",
    CANCELED: "bg-cream text-ink-soft border-rule-soft",
};

/** Used by rows to highlight which invoices need attention. */
export const invoiceStatusAccent: Record<InvoiceStatus, string> = {
    PAID: "bg-jade-500",
    DUE: "bg-coral-500",
    PARTIAL: "bg-coral-400",
    OVERDUE: "bg-coral-600",
    CANCELED: "bg-ink-soft/30",
};

export function invoiceStatusLabel(status: InvoiceStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export function getInvoiceStatusTone(status: string): string {
    return (
        invoiceStatusStyles[status as InvoiceStatus] ?? invoiceStatusStyles.DUE
    );
}

// ─────────────────────────────────────────────────────────────────
// TYPE — quiet tints, all within the brand family.
//   RENT     → jade (the default, recurring case)
//   DEPOSIT  → coral-soft (rare, one-time)
//   UTILITY  → cream (neutral)
//   PENALTY  → coral (warning)
//   OTHER    → neutral
// ─────────────────────────────────────────────────────────────────

export const invoiceTypeStyles: Record<InvoiceType, string> = {
    RENT: "bg-jade-50 text-jade-800 border-jade-100",
    DEPOSIT: "bg-coral-50/60 text-coral-700 border-coral-100",
    UTILITY: "bg-cream text-ink border-rule-soft",
    PENALTY: "bg-coral-50 text-coral-700 border-coral-100",
    OTHER: "bg-cream/60 text-ink-soft border-rule-soft",
};

export function invoiceTypeLabel(type: InvoiceType): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
}

// ─────────────────────────────────────────────────────────────────
// BILLING MONTH helpers
// ─────────────────────────────────────────────────────────────────

/**
 * Convert a `<input type="month">` value ("2026-07") to a backend-ready
 * date string ("2026-07-01"). Pass-through if not in YYYY-MM format.
 */
export function toBillingMonthDate(yearMonth: string): string {
    if (/^\d{4}-\d{2}$/.test(yearMonth)) {
        return `${yearMonth}-01`;
    }
    return yearMonth;
}

/** Format a billing month for display: "May 2026" */
export function formatBillingMonth(month: string | Date): string {
    let d: Date;
    if (month instanceof Date) {
        d = month;
    } else if (/^\d{4}-\d{2}$/.test(month)) {
        d = new Date(`${month}-01T00:00:00`);
    } else {
        d = new Date(month);
    }
    if (isNaN(d.getTime())) return String(month);
    return d.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });
}