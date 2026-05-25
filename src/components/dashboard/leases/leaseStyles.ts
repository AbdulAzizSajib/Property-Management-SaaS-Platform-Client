// src/components/dashboard/leases/leaseStyles.ts
//
// Single source of truth for lease visual treatment.
// Used by tenant detail, unit detail, leases list, leases detail.

import type { LeaseStatus } from "@/src/types/lease.types";

// ─────────────────────────────────────────────────────────────────
// STATUS BADGES — same semantic discipline as unitStatus:
//   ACTIVE      → jade  (good, money flowing)
//   PENDING     → coral (needs your attention — sign or reject)
//   TERMINATED  → ink-soft (archival)
//   EXPIRED     → ink-soft (archival, ended naturally)
// ─────────────────────────────────────────────────────────────────

export const leaseStatusStyles: Record<LeaseStatus, string> = {
    ACTIVE: "bg-jade-50 text-jade-800 border-jade-100",
    PENDING: "bg-coral-50 text-coral-700 border-coral-100",
    TERMINATED: "bg-cream text-ink-soft border-rule-soft",
    EXPIRED: "bg-cream text-ink-soft border-rule-soft",
};

/** Used by lease cards to highlight which leases need attention. */
export const leaseStatusAccent: Record<LeaseStatus, string> = {
    ACTIVE: "bg-jade-500",
    PENDING: "bg-coral-500",
    TERMINATED: "bg-ink-soft/30",
    EXPIRED: "bg-ink-soft/30",
};

export function leaseStatusLabel(status: LeaseStatus | "ALL"): string {
    if (status === "ALL") return "All";
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export function getLeaseStatusTone(status: string): string {
    return (
        leaseStatusStyles[status as LeaseStatus] ?? leaseStatusStyles.TERMINATED
    );
}

// ─────────────────────────────────────────────────────────────────
// INVOICE STATUS — semantic, same family:
//   PAID    → jade  (resolved, money received)
//   PARTIAL → coral-soft (in-progress, partial payment received)
//   DUE     → coral (open, needs collection)
//   OVERDUE → coral (open + late — same coral, just labelled differently)
//   VOID    → ink-soft (archival)
// ─────────────────────────────────────────────────────────────────

export const invoiceStatusStyles: Record<string, string> = {
    PAID: "bg-jade-50 text-jade-800 border-jade-100",
    PARTIAL: "bg-coral-50/60 text-coral-700 border-coral-100",
    DUE: "bg-coral-50 text-coral-700 border-coral-100",
    OVERDUE: "bg-coral-50 text-coral-700 border-coral-100",
    VOID: "bg-cream text-ink-soft border-rule-soft",
};

export function getInvoiceStatusTone(status: string): string {
    return invoiceStatusStyles[status] ?? invoiceStatusStyles.DUE;
}