// src/components/dashboard/buildings/building-helpers.ts
//
// Single source for type label + type badge color tokens, so the list page
// and detail page can never drift out of sync.

import type { BuildingType } from "@/src/types/building.types";

const typeLabels: Record<BuildingType, string> = {
    RESIDENTIAL: "Residential",
    COMMERCIAL: "Commercial",
    MIXED: "Mixed",
    HOSTEL: "Hostel",
    MESS: "Mess",
};

const typeLabelsBn: Record<BuildingType, string> = {
    RESIDENTIAL: "আবাসিক",
    COMMERCIAL: "বাণিজ্যিক",
    MIXED: "মিশ্র",
    HOSTEL: "হোস্টেল",
    MESS: "মেস",
};

export function typeLabel(t: BuildingType): string {
    return typeLabels[t] ?? t;
}

export function typeLabelBn(t: BuildingType): string {
    return typeLabelsBn[t] ?? t;
}

// Semantic, not rainbow:
//   residential = jade  (the most common case, our default brand)
//   commercial  = ink-soft (neutral, professional)
//   mixed       = coral-soft (the visually-distinct exception)
//   hostel/mess = jade-soft (people-centric, recurring)
export const typeBadgeStyles: Record<BuildingType, string> = {
    RESIDENTIAL: "bg-jade-50 text-jade-800 border-jade-100",
    COMMERCIAL: "bg-cream text-ink border-rule-soft",
    MIXED: "bg-coral-50 text-coral-700 border-coral-100",
    HOSTEL: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    MESS: "bg-jade-50/60 text-jade-700 border-jade-100/70",
};

export const statusBadgeStyles = (active: boolean) =>
    active
        ? "bg-jade-50 text-jade-800 border-jade-100"
        : "bg-cream text-ink-soft border-rule-soft";
