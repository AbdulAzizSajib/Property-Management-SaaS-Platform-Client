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
    INTERNET: "bg-coral-50/60 text-coral-600 border-coral-100",
    GENERATOR_FUEL: "bg-coral-50 text-coral-600 border-coral-100",
    SECURITY_SALARY: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    CARETAKER_SALARY: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    CLEANER_SALARY: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    LIFT_MAINTENANCE: "bg-cream text-ink border-rule-soft",
    REPAIRING: "bg-cream text-ink border-rule-soft",
    CLEANING: "bg-cream/80 text-ink border-rule-soft",
    TAX: "bg-ink-soft/10 text-ink border-rule-soft",
    INSURANCE: "bg-ink-soft/10 text-ink border-rule-soft",
    OTHER: "bg-cream/60 text-ink-soft border-rule-soft",
};

/** Left-edge accent on list rows — same semantic as category. */
export const expenseCategoryAccent: Record<ExpenseCategory, string> = {
    ELECTRICITY: "bg-coral-400",
    WATER: "bg-coral-400",
    GAS: "bg-coral-400",
    INTERNET: "bg-coral-400",
    GENERATOR_FUEL: "bg-coral-500",
    SECURITY_SALARY: "bg-jade-500",
    CARETAKER_SALARY: "bg-jade-500",
    CLEANER_SALARY: "bg-jade-500",
    LIFT_MAINTENANCE: "bg-ink-soft/30",
    REPAIRING: "bg-ink-soft/30",
    CLEANING: "bg-ink-soft/30",
    TAX: "bg-ink-soft/40",
    INSURANCE: "bg-ink-soft/40",
    OTHER: "bg-ink-soft/20",
};

const categoryLabels: Record<ExpenseCategory, string> = {
    ELECTRICITY: "Electricity",
    WATER: "Water",
    GAS: "Gas",
    INTERNET: "Internet",
    SECURITY_SALARY: "Security salary",
    CARETAKER_SALARY: "Caretaker salary",
    CLEANER_SALARY: "Cleaner salary",
    LIFT_MAINTENANCE: "Lift",
    GENERATOR_FUEL: "Generator fuel",
    REPAIRING: "Repairing",
    CLEANING: "Cleaning",
    TAX: "Tax",
    INSURANCE: "Insurance",
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
