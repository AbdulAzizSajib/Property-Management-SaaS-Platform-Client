// src/components/dashboard/expenses/expenseStyles.ts
//
// Single source of truth for expense visual treatment.
// All tints stay within the jade / coral / cream family — no rainbow.

import type { ExpenseCategory } from "@/src/types/expense.types";

// ─────────────────────────────────────────────────────────────────
// CATEGORY — quiet tints, all within the brand family.
//   Utilities (electricity/water/gas/fuel/internet) → coral-soft (recurring drain)
//   Operations (maintenance/repair/cleaning/security/waste/lift) → cream/neutral
//   Compliance (property tax / legal) → ink-soft (admin)
//   Salary → jade-soft (people, recurring)
//   Other → neutral
// ─────────────────────────────────────────────────────────────────

export const expenseCategoryStyles: Record<ExpenseCategory, string> = {
    ELECTRICITY: "bg-coral-50/60 text-coral-600 border-coral-100",
    WATER: "bg-coral-50/60 text-coral-600 border-coral-100",
    GAS: "bg-coral-50/60 text-coral-600 border-coral-100",
    GENERATOR_FUEL: "bg-coral-50 text-coral-600 border-coral-100",
    INTERNET: "bg-coral-50/60 text-coral-600 border-coral-100",
    MAINTENANCE: "bg-cream text-ink border-rule-soft",
    REPAIR: "bg-cream text-ink border-rule-soft",
    CLEANING: "bg-cream/80 text-ink border-rule-soft",
    SECURITY: "bg-cream text-ink border-rule-soft",
    WASTE_MANAGEMENT: "bg-cream/60 text-ink-soft border-rule-soft",
    LIFT_MAINTENANCE: "bg-cream text-ink border-rule-soft",
    PROPERTY_TAX: "bg-ink-soft/10 text-ink border-rule-soft",
    LEGAL_FEES: "bg-ink-soft/10 text-ink border-rule-soft",
    SALARY: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    OTHER: "bg-cream/60 text-ink-soft border-rule-soft",
};

/** Left-edge accent on list rows — same semantic as category. */
export const expenseCategoryAccent: Record<ExpenseCategory, string> = {
    ELECTRICITY: "bg-coral-400",
    WATER: "bg-coral-400",
    GAS: "bg-coral-400",
    GENERATOR_FUEL: "bg-coral-500",
    INTERNET: "bg-coral-400",
    MAINTENANCE: "bg-ink-soft/30",
    REPAIR: "bg-ink-soft/30",
    CLEANING: "bg-ink-soft/30",
    SECURITY: "bg-ink-soft/30",
    WASTE_MANAGEMENT: "bg-ink-soft/30",
    LIFT_MAINTENANCE: "bg-ink-soft/30",
    PROPERTY_TAX: "bg-ink-soft/40",
    LEGAL_FEES: "bg-ink-soft/40",
    SALARY: "bg-jade-500",
    OTHER: "bg-ink-soft/20",
};

const categoryLabels: Record<ExpenseCategory, string> = {
    ELECTRICITY: "Electricity",
    WATER: "Water",
    GAS: "Gas",
    GENERATOR_FUEL: "Generator fuel",
    INTERNET: "Internet",
    MAINTENANCE: "Maintenance",
    REPAIR: "Repair",
    CLEANING: "Cleaning",
    SECURITY: "Security",
    WASTE_MANAGEMENT: "Waste",
    LIFT_MAINTENANCE: "Lift",
    PROPERTY_TAX: "Property tax",
    LEGAL_FEES: "Legal",
    SALARY: "Salary",
    OTHER: "Other",
};

export function expenseCategoryLabel(category: ExpenseCategory): string {
    return categoryLabels[category] ?? category;
}

// ─────────────────────────────────────────────────────────────────
// DATE helpers
// ─────────────────────────────────────────────────────────────────

/** Convert a Date or ISO string to the "YYYY-MM-DD" value an <input type="date"> wants. */
export function toDateInputValue(value: string | Date): string {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** Pretty-print an ISO date as "1 Jun 2026". */
export function formatExpenseDate(value: string | Date): string {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
