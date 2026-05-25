// src/components/dashboard/buildings/building-helpers.ts
//
// Single source for type label + type badge color tokens, so the list page
// and detail page can never drift out of sync.

import type { BuildingType } from "@/src/types/building.types";

export function typeLabel(t: BuildingType): string {
    return t === "MIXED_USE"
        ? "Mixed use"
        : t.charAt(0) + t.slice(1).toLowerCase();
}

// Semantic, not rainbow:
//   residential = jade (the most common case, our default brand)
//   commercial  = ink-soft (neutral, professional)
//   mixed       = coral-soft (the visually-distinct exception)
export const typeBadgeStyles: Record<BuildingType, string> = {
    RESIDENTIAL: "bg-jade-50 text-jade-800 border-jade-100",
    COMMERCIAL: "bg-cream text-ink border-rule-soft",
    MIXED_USE: "bg-coral-50 text-coral-700 border-coral-100",
};

export const statusBadgeStyles = (active: boolean) =>
    active
        ? "bg-jade-50 text-jade-800 border-jade-100"
        : "bg-cream text-ink-soft border-rule-soft";