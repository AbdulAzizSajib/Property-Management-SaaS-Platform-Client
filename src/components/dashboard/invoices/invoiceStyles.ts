import type { InvoiceStatus, InvoiceType } from "@/src/types/invoice.types";

export const invoiceStatusStyles: Record<InvoiceStatus, string> = {
    DUE: "bg-amber-50 text-amber-700 border-amber-200",
    PARTIAL: "bg-sky-50 text-sky-700 border-sky-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    OVERDUE: "bg-rose-50 text-rose-700 border-rose-200",
    CANCELED: "bg-slate-100 text-slate-600 border-slate-200",
};

export const invoiceTypeStyles: Record<InvoiceType, string> = {
    RENT: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DEPOSIT: "bg-violet-50 text-violet-700 border-violet-200",
    PENALTY: "bg-rose-50 text-rose-700 border-rose-200",
    UTILITY: "bg-sky-50 text-sky-700 border-sky-200",
    OTHER: "bg-slate-100 text-slate-700 border-slate-200",
};

export function invoiceStatusLabel(status: InvoiceStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export function invoiceTypeLabel(type: InvoiceType): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
}

/**
 * Returns "YYYY-MM" string for the first of a month.
 * Used for billing-month inputs (the backend accepts YYYY-MM-DD; we always send the 1st).
 */
export function toBillingMonthDate(yearMonth: string): string {
    // yearMonth is "2026-07" from <input type="month">; emit "2026-07-01"
    if (/^\d{4}-\d{2}$/.test(yearMonth)) {
        return `${yearMonth}-01`;
    }
    return yearMonth;
}

export function formatBillingMonth(iso: string): string {
    return new Date(iso).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    });
}
