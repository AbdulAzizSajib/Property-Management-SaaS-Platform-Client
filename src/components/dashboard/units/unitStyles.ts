// src/components/dashboard/units/unitStyles.ts

import type { UnitStatus, UnitType } from "@/src/types/unit.types";
import { fmtTaka } from "@/src/lib/numerals";

// ─────────────────────────────────────────────────────────────────
// STATUS — semantic, color carries meaning. Use the brand palette,
// not random emerald/amber/rose.
//
//   VACANT     → coral (needs your attention — find a tenant)
//   OCCUPIED   → jade  (healthy state — money coming in)
//   RESERVED   → jade-pale (positive but tentative)
//   MAINT.     → ink-soft (neutral, not negative)
// ─────────────────────────────────────────────────────────────────

export const unitStatusStyles: Record<UnitStatus, string> = {
    VACANT: "bg-coral-50 text-coral-700 border-coral-100",
    OCCUPIED: "bg-jade-50 text-jade-800 border-jade-100",
    RESERVED: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    UNDER_MAINTENANCE: "bg-cream text-ink-soft border-rule-soft",
};

/** Used by UnitsPanel cards to highlight which units actually need attention. */
export const unitStatusAccent: Record<UnitStatus, string> = {
    VACANT: "bg-coral-500",
    OCCUPIED: "bg-transparent",
    RESERVED: "bg-jade-300",
    UNDER_MAINTENANCE: "bg-ink-soft/30",
};

// ─────────────────────────────────────────────────────────────────
// TYPE — 6 distinct tints, all within the jade/coral/cream family.
// No indigo/violet/sky/amber. Each tint is subtle so they read as
// labels, not status alerts.
// ─────────────────────────────────────────────────────────────────

export const unitTypeStyles: Record<UnitType, string> = {
    FLAT: "bg-jade-50 text-jade-800 border-jade-100",
    SHOP: "bg-coral-50 text-coral-700 border-coral-100",
    OFFICE: "bg-cream text-ink border-rule-soft",
    ROOM: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    GARAGE: "bg-cream/60 text-ink-soft border-rule-soft",
    WAREHOUSE: "bg-ink-soft/10 text-ink border-rule-soft",
};

// ─────────────────────────────────────────────────────────────────
// LABEL HELPERS — pretty print enums for the UI.
// ─────────────────────────────────────────────────────────────────

export function statusLabel(status: UnitStatus): string {
    if (status === "UNDER_MAINTENANCE") return "Maintenance";
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export function typeLabel(type: UnitType): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
}

// ─────────────────────────────────────────────────────────────────
// MONEY — defers to the shared numerals helper so currency rendering
// is consistent across the whole app (and can flip to Bangla numerals
// later via a single switch).
// ─────────────────────────────────────────────────────────────────

export function formatMoney(value: string | number, opts: { bn?: boolean; compact?: boolean } = {}): string {
    const n = typeof value === "string" ? parseFloat(value) : value;
    return fmtTaka(isNaN(n) ? 0 : n, opts);
}