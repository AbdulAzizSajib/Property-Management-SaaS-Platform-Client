import type { LeaseStatus } from "@/src/types/lease.types";

export const leaseStatusStyles: Record<LeaseStatus, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    TERMINATED: "bg-slate-100 text-slate-600 border-slate-200",
    EXPIRED: "bg-rose-50 text-rose-700 border-rose-200",
    RENEWED: "bg-violet-50 text-violet-700 border-violet-200",
};

export function leaseStatusLabel(status: LeaseStatus): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
}
