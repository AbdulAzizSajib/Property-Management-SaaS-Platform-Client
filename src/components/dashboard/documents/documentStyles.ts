// src/components/dashboard/documents/documentStyles.ts
//
// Single source of truth for document visual treatment.
// All tints stay within the jade / coral / cream family — no rainbow.

import type { DocumentType } from "@/src/types/document.types";
import {
    File as FileIcon,
    FileImage,
    FileSpreadsheet,
    FileText,
    type LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// TYPE — quiet tints, brand family.
//   Identity (NID/Passport/License/Photo)  → jade-soft (people records)
//   Contracts (Lease/Rental/Deed)           → jade  (anchor docs)
//   Receipts (tax/utility/invoice/expense)  → coral-soft (financial trail)
//   Records (insurance/maintenance/bank)    → cream (operational)
//   Other                                   → neutral
// ─────────────────────────────────────────────────────────────────

export const documentTypeStyles: Record<DocumentType, string> = {
    NID: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    PASSPORT: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    DRIVING_LICENSE: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    TENANT_PHOTO: "bg-jade-50/60 text-jade-700 border-jade-100/70",
    LEASE_AGREEMENT: "bg-jade-50 text-jade-800 border-jade-100",
    RENTAL_AGREEMENT: "bg-jade-50 text-jade-800 border-jade-100",
    BUILDING_DEED: "bg-jade-50 text-jade-800 border-jade-100",
    PROPERTY_TAX_RECEIPT: "bg-coral-50/60 text-coral-700 border-coral-100",
    UTILITY_BILL: "bg-coral-50/60 text-coral-700 border-coral-100",
    INVOICE_RECEIPT: "bg-coral-50/60 text-coral-700 border-coral-100",
    EXPENSE_RECEIPT: "bg-coral-50/60 text-coral-700 border-coral-100",
    INSURANCE: "bg-cream text-ink border-rule-soft",
    MAINTENANCE_RECORD: "bg-cream text-ink border-rule-soft",
    BANK_STATEMENT: "bg-cream text-ink border-rule-soft",
    OTHER: "bg-cream/60 text-ink-soft border-rule-soft",
};

const typeLabels: Record<DocumentType, string> = {
    NID: "NID",
    PASSPORT: "Passport",
    DRIVING_LICENSE: "Driving license",
    TENANT_PHOTO: "Tenant photo",
    LEASE_AGREEMENT: "Lease",
    RENTAL_AGREEMENT: "Rental agreement",
    BUILDING_DEED: "Building deed",
    PROPERTY_TAX_RECEIPT: "Property tax",
    UTILITY_BILL: "Utility bill",
    INVOICE_RECEIPT: "Invoice receipt",
    EXPENSE_RECEIPT: "Expense receipt",
    INSURANCE: "Insurance",
    MAINTENANCE_RECORD: "Maintenance",
    BANK_STATEMENT: "Bank statement",
    OTHER: "Other",
};

export function documentTypeLabel(type: DocumentType): string {
    return typeLabels[type] ?? type;
}

// ─────────────────────────────────────────────────────────────────
// File icon + tint based on mimeType
// ─────────────────────────────────────────────────────────────────

export interface FileGlyph {
    Icon: LucideIcon;
    /** Tailwind classes for the icon-circle wrapper. */
    bg: string;
    /** Tailwind class for the icon color. */
    fg: string;
}

export function getFileGlyph(mimeType: string | null | undefined): FileGlyph {
    const mt = (mimeType ?? "").toLowerCase();
    if (mt.startsWith("image/")) {
        return {
            Icon: FileImage,
            bg: "bg-jade-50",
            fg: "text-jade-700",
        };
    }
    if (mt === "application/pdf") {
        return {
            Icon: FileText,
            bg: "bg-coral-50",
            fg: "text-coral-700",
        };
    }
    if (
        mt.includes("spreadsheet") ||
        mt.includes("excel") ||
        mt === "text/csv"
    ) {
        return {
            Icon: FileSpreadsheet,
            bg: "bg-jade-50/70",
            fg: "text-jade-800",
        };
    }
    if (
        mt.includes("word") ||
        mt === "text/plain" ||
        mt.includes("document")
    ) {
        return {
            Icon: FileText,
            bg: "bg-cream",
            fg: "text-ink",
        };
    }
    return {
        Icon: FileIcon,
        bg: "bg-cream/80",
        fg: "text-ink-soft",
    };
}

// ─────────────────────────────────────────────────────────────────
// File-size formatting
// ─────────────────────────────────────────────────────────────────

/** "99.8 KB" / "1.4 MB" / "12 B" */
export function formatFileSize(bytes: number | null | undefined): string {
    if (bytes == null || isNaN(bytes) || bytes < 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb < 10 ? mb.toFixed(2) : mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb < 10 ? gb.toFixed(2) : gb.toFixed(1)} GB`;
}

/** "1 Jun 2026" */
export function formatDocumentDate(value: string | Date): string {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** Shorten a mime type for display: "application/pdf" → "PDF" */
export function shortMime(mimeType: string | null | undefined): string {
    if (!mimeType) return "—";
    const lower = mimeType.toLowerCase();
    if (lower === "application/pdf") return "PDF";
    if (lower.startsWith("image/")) return lower.split("/")[1].toUpperCase();
    if (lower.includes("spreadsheet") || lower.includes("excel"))
        return "XLSX";
    if (lower.includes("word") || lower.includes("document")) return "DOCX";
    if (lower === "text/csv") return "CSV";
    if (lower === "text/plain") return "TXT";
    return lower.split("/").pop()?.toUpperCase() ?? mimeType;
}
