// src/components/dashboard/complaints/complaintStyles.ts
//
// Single source of truth for complaint visual treatment.
// Stays within the jade / coral / cream family — no rainbow.

import type {
    ComplaintCategory,
    ComplaintPriority,
    ComplaintStatus,
} from "@/src/types/complaint.types";

// ─────────────────────────────────────────────────────────────────
// STATUS
//   OPEN        → coral (needs attention — fresh complaint)
//   IN_PROGRESS → coral-soft (in flight, someone's on it)
//   RESOLVED    → jade (good — fixed)
//   CLOSED      → ink-soft (archival, no further action)
// ─────────────────────────────────────────────────────────────────

export const complaintStatusStyles: Record<ComplaintStatus, string> = {
    OPEN: "bg-coral-50 text-coral-700 border-coral-100",
    IN_PROGRESS: "bg-coral-50/60 text-coral-700 border-coral-100",
    RESOLVED: "bg-jade-50 text-jade-800 border-jade-100",
    CLOSED: "bg-cream text-ink-soft border-rule-soft",
};

export const complaintStatusAccent: Record<ComplaintStatus, string> = {
    OPEN: "bg-coral-500",
    IN_PROGRESS: "bg-coral-400",
    RESOLVED: "bg-jade-500",
    CLOSED: "bg-ink-soft/30",
};

const statusLabels: Record<ComplaintStatus, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
};

export function complaintStatusLabel(status: ComplaintStatus): string {
    return statusLabels[status] ?? status;
}

// ─────────────────────────────────────────────────────────────────
// PRIORITY
//   LOW    → cream/ink-soft (background)
//   MEDIUM → cream/ink (slightly more weight)
//   HIGH   → coral (warning)
//   URGENT → coral-strong (alarm)
// ─────────────────────────────────────────────────────────────────

export const complaintPriorityStyles: Record<ComplaintPriority, string> = {
    LOW: "bg-cream/60 text-ink-soft border-rule-soft",
    MEDIUM: "bg-cream text-ink border-rule-soft",
    HIGH: "bg-coral-50/60 text-coral-700 border-coral-100",
    URGENT: "bg-coral-50 text-coral-700 border-coral-100",
};

const priorityLabels: Record<ComplaintPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
};

export function complaintPriorityLabel(priority: ComplaintPriority): string {
    return priorityLabels[priority] ?? priority;
}

/** Used by the priority dot on list rows. */
export const complaintPriorityDot: Record<ComplaintPriority, string> = {
    LOW: "bg-ink-soft/30",
    MEDIUM: "bg-ink-soft/55",
    HIGH: "bg-coral-500",
    URGENT: "bg-coral-600",
};

// ─────────────────────────────────────────────────────────────────
// CATEGORY — quiet tints, brand family only.
// Utilities & safety hazards → coral / coral-soft.
// Comfort & operational → cream / neutral.
// ─────────────────────────────────────────────────────────────────

export const complaintCategoryStyles: Record<ComplaintCategory, string> = {
    PLUMBING: "bg-coral-50/60 text-coral-700 border-coral-100",
    ELECTRICAL: "bg-coral-50 text-coral-700 border-coral-100",
    AC: "bg-cream text-ink border-rule-soft",
    ELEVATOR: "bg-cream/80 text-ink border-rule-soft",
    WATER: "bg-coral-50/60 text-coral-700 border-coral-100",
    GAS: "bg-coral-50 text-coral-700 border-coral-100",
    SECURITY: "bg-coral-50 text-coral-700 border-coral-100",
    CLEANLINESS: "bg-cream text-ink border-rule-soft",
    NOISE: "bg-cream/60 text-ink-soft border-rule-soft",
    PEST_CONTROL: "bg-cream text-ink border-rule-soft",
    STRUCTURAL: "bg-coral-50 text-coral-700 border-coral-100",
    INTERNET: "bg-cream/60 text-ink-soft border-rule-soft",
    PARKING: "bg-cream/60 text-ink-soft border-rule-soft",
    OTHER: "bg-cream/60 text-ink-soft border-rule-soft",
};

const categoryLabels: Record<ComplaintCategory, string> = {
    PLUMBING: "Plumbing",
    ELECTRICAL: "Electrical",
    AC: "AC",
    ELEVATOR: "Elevator",
    WATER: "Water",
    GAS: "Gas",
    SECURITY: "Security",
    CLEANLINESS: "Cleanliness",
    NOISE: "Noise",
    PEST_CONTROL: "Pest control",
    STRUCTURAL: "Structural",
    INTERNET: "Internet",
    PARKING: "Parking",
    OTHER: "Other",
};

export function complaintCategoryLabel(category: ComplaintCategory): string {
    return categoryLabels[category] ?? category;
}

// ─────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────

/** "1 Jun 2026" */
export function formatComplaintDate(value: string | Date): string {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** Quick "2 days ago" style label for the list row. */
export function formatRelativeTime(value: string | Date): string {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "";
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.round(diffMs / 1000);
    if (diffSec < 60) return "just now";
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    if (diffDay < 30) return `${diffDay}d ago`;
    const diffMo = Math.round(diffDay / 30);
    if (diffMo < 12) return `${diffMo}mo ago`;
    const diffYr = Math.round(diffMo / 12);
    return `${diffYr}y ago`;
}
