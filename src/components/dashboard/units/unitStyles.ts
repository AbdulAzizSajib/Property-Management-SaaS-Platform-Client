import type { UnitStatus, UnitType } from "@/src/types/unit.types";

export const unitStatusStyles: Record<UnitStatus, string> = {
    VACANT: "bg-amber-50 text-amber-700 border-amber-200",
    OCCUPIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    UNDER_MAINTENANCE: "bg-rose-50 text-rose-700 border-rose-200",
    RESERVED: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export const unitTypeStyles: Record<UnitType, string> = {
    FLAT: "bg-indigo-50 text-indigo-700 border-indigo-200",
    STUDIO: "bg-violet-50 text-violet-700 border-violet-200",
    SHOP: "bg-emerald-50 text-emerald-700 border-emerald-200",
    OFFICE: "bg-sky-50 text-sky-700 border-sky-200",
    WAREHOUSE: "bg-slate-100 text-slate-700 border-slate-200",
};

export function statusLabel(status: UnitStatus): string {
    return status === "UNDER_MAINTENANCE"
        ? "Maintenance"
        : status.charAt(0) + status.slice(1).toLowerCase();
}

export function typeLabel(type: UnitType): string {
    return type.charAt(0) + type.slice(1).toLowerCase();
}

export const fmtBDT = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
});

export function formatMoney(value: string | number): string {
    const n = typeof value === "string" ? parseFloat(value) : value;
    return fmtBDT.format(isNaN(n) ? 0 : n);
}
