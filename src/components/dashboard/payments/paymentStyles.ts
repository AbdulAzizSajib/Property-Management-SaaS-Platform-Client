import type { PaymentMethod, PaymentStatus } from "@/src/types/payment.types";

export const paymentMethodStyles: Record<PaymentMethod, string> = {
    CASH: "bg-emerald-50 text-emerald-700 border-emerald-200",
    BKASH: "bg-pink-50 text-pink-700 border-pink-200",
    NAGAD: "bg-orange-50 text-orange-700 border-orange-200",
    ROCKET: "bg-violet-50 text-violet-700 border-violet-200",
    BANK_TRANSFER: "bg-sky-50 text-sky-700 border-sky-200",
    CARD: "bg-indigo-50 text-indigo-700 border-indigo-200",
    CHEQUE: "bg-amber-50 text-amber-700 border-amber-200",
    OTHER: "bg-slate-100 text-slate-700 border-slate-200",
};

export const paymentStatusStyles: Record<PaymentStatus, string> = {
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    FAILED: "bg-rose-50 text-rose-700 border-rose-200",
    REFUNDED: "bg-slate-100 text-slate-600 border-slate-200",
};

export function paymentMethodLabel(method: PaymentMethod): string {
    if (method === "BANK_TRANSFER") return "Bank Transfer";
    if (method === "BKASH") return "bKash";
    return method.charAt(0) + method.slice(1).toLowerCase();
}

export function paymentStatusLabel(status: PaymentStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
}
