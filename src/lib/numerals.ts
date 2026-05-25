// src/lib/numerals.ts
// Single source of truth for number/currency formatting.
// Pass `bn: true` to render Bangla numerals (১,২,৩…) — keeps the brand promise
// of bilingual support without scattering Intl logic across components.

const enToBn: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
};

export const toBnDigits = (s: string) =>
    s.replace(/[0-9]/g, (d) => enToBn[d]);

// BDT lakh/crore formatting (en-IN grouping reads naturally for BD users too)
export function fmtTaka(n: number, opts: { bn?: boolean; compact?: boolean } = {}) {
    const { bn = false, compact = false } = opts;
    let out: string;
    if (compact && n >= 100000) {
        // ৳ 4.18 L  or  ৳ 1.2 Cr
        if (n >= 10000000) out = `৳ ${(n / 10000000).toFixed(2)} Cr`;
        else out = `৳ ${(n / 100000).toFixed(2)} L`;
    } else {
        out = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "BDT",
            maximumFractionDigits: 0,
        })
            .format(n)
            .replace("BDT", "৳")
            .trim();
    }
    return bn ? toBnDigits(out) : out;
}

export function fmtNum(n: number, bn = false) {
    const s = new Intl.NumberFormat("en-IN").format(n);
    return bn ? toBnDigits(s) : s;
}

export function fmtPct(n: number, bn = false) {
    const s = `${n.toFixed(1)}%`;
    return bn ? toBnDigits(s) : s;
}