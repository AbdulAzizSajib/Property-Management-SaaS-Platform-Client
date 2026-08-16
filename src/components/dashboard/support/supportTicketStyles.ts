// src/components/dashboard/support/supportTicketStyles.ts
//
// Single source of truth for support ticket visual treatment.
// Stays within the jade / coral / cream family — no rainbow. Mirrors
// complaintStyles.ts's structure/naming for consistency across modules.

import type {
    SupportTicketCategory,
    SupportTicketPriority,
    SupportTicketStatus,
} from "@/src/types/supportTicket.types";

export { formatRelativeTime } from "@/src/components/dashboard/complaints/complaintStyles";

// ─────────────────────────────────────────────────────────────────
// STATUS
//   OPEN        → coral (needs attention — fresh ticket)
//   IN_PROGRESS → coral-soft (in flight, someone's on it)
//   RESOLVED    → jade (good — answered)
//   CLOSED      → ink-soft (archival, no further action)
// ─────────────────────────────────────────────────────────────────

export const supportTicketStatusStyles: Record<SupportTicketStatus, string> =
    {
        OPEN: "bg-coral-50 text-coral-600 border-coral-100",
        IN_PROGRESS: "bg-coral-50/60 text-coral-600 border-coral-100",
        RESOLVED: "bg-jade-50 text-jade-800 border-jade-100",
        CLOSED: "bg-cream text-ink-soft border-rule-soft",
    };

export const supportTicketStatusAccent: Record<SupportTicketStatus, string> =
    {
        OPEN: "bg-coral-500",
        IN_PROGRESS: "bg-coral-400",
        RESOLVED: "bg-jade-500",
        CLOSED: "bg-ink-soft/30",
    };

const statusLabels: Record<SupportTicketStatus, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
};

export function supportTicketStatusLabel(status: SupportTicketStatus): string {
    return statusLabels[status] ?? status;
}

// ─────────────────────────────────────────────────────────────────
// PRIORITY — same scale as complaints.
// ─────────────────────────────────────────────────────────────────

export const supportTicketPriorityStyles: Record<
    SupportTicketPriority,
    string
> = {
    LOW: "bg-cream/60 text-ink-soft border-rule-soft",
    MEDIUM: "bg-cream text-ink border-rule-soft",
    HIGH: "bg-coral-50/60 text-coral-600 border-coral-100",
    URGENT: "bg-coral-50 text-coral-600 border-coral-100",
};

const priorityLabels: Record<SupportTicketPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

export function supportTicketPriorityLabel(
    priority: SupportTicketPriority,
): string {
    return priorityLabels[priority] ?? priority;
}

export const supportTicketPriorityDot: Record<SupportTicketPriority, string> =
    {
        LOW: "bg-ink-soft/30",
        MEDIUM: "bg-ink-soft/55",
        HIGH: "bg-coral-500",
        URGENT: "bg-coral-600",
    };

// ─────────────────────────────────────────────────────────────────
// CATEGORY — quiet tints, brand family only.
// ─────────────────────────────────────────────────────────────────

export const supportTicketCategoryStyles: Record<
    SupportTicketCategory,
    string
> = {
    BILLING: "bg-coral-50/60 text-coral-600 border-coral-100",
    TECHNICAL: "bg-cream text-ink border-rule-soft",
    ACCOUNT: "bg-cream/80 text-ink border-rule-soft",
    FEATURE_REQUEST: "bg-cream/60 text-ink-soft border-rule-soft",
    OTHER: "bg-cream/60 text-ink-soft border-rule-soft",
};

const categoryLabels: Record<SupportTicketCategory, string> = {
    BILLING: "Billing",
    TECHNICAL: "Technical",
    ACCOUNT: "Account",
    FEATURE_REQUEST: "Feature request",
    OTHER: "Other",
};

export function supportTicketCategoryLabel(
    category: SupportTicketCategory,
): string {
    return categoryLabels[category] ?? category;
}

// ─────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────

/** "1 Jun 2026" */
export function formatSupportTicketDate(value: string | Date): string {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
