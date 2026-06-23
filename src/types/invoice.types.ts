import type { Building } from "./building.types";
import type { Lease } from "./lease.types";
import type { Tenant } from "./tenant.types";
import type { Unit } from "./unit.types";

export type InvoiceStatus = "DUE" | "PARTIAL" | "PAID" | "OVERDUE" | "CANCELED";

export type InvoiceType = "RENT" | "DEPOSIT" | "PENALTY" | "UTILITY" | "OTHER";

export const INVOICE_STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
    { value: "DUE", label: "Due" },
    { value: "PARTIAL", label: "Partial" },
    { value: "PAID", label: "Paid" },
    { value: "OVERDUE", label: "Overdue" },
    { value: "CANCELED", label: "Canceled" },
];

export const INVOICE_TYPE_OPTIONS: { value: InvoiceType; label: string }[] = [
    { value: "RENT", label: "Rent" },
    { value: "DEPOSIT", label: "Deposit" },
    { value: "PENALTY", label: "Penalty" },
    { value: "UTILITY", label: "Utility" },
    { value: "OTHER", label: "Other" },
];

/**
 * Per-utility breakdown stored on the invoice when the lease is billed
 * with billingMode = "FIXED_SEPARATE". All amounts as numbers from the
 * backend's JSON column. Keys are open-ended (gas/water/electricity/internet
 * but other custom keys may appear), so we keep them loose.
 */
export type InvoiceUtilities = Record<string, number>;

// Backend returns Prisma Decimal as a string.
export interface Invoice {
    id: string;
    invoiceNumber: string;
    type: InvoiceType;
    status: InvoiceStatus;
    billingMonth: string;
    issueDate: string;
    dueDate: string;
    rentAmount: string;
    serviceCharge: string;
    utilityAmount: string;
    penaltyAmount: string;
    totalAmount: string;
    paidAmount: string;
    dueAmount: string;
    notes: string | null;
    /** Per-utility breakdown — only present for FIXED_SEPARATE leases. */
    utilities?: InvoiceUtilities | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    leaseId: string;
    unitId: string;
    tenantId: string;
}

export interface InvoiceTenantSummary {
    id: string;
    name: string;
    phone: string;
}

export interface InvoiceUnitSummary {
    id: string;
    name: string;
    building: {
        id: string;
        name: string;
    };
}

// GET /invoices — list item
export interface InvoiceListItem extends Invoice {
    tenant: InvoiceTenantSummary;
    unit: InvoiceUnitSummary;
}

export interface InvoicePaymentSummary {
    id: string;
    amount: string;
    method: string;
    transactionId: string | null;
    notes: string | null;
    createdAt: string;
}

export type LineItemCategory =
    | "RENT"
    | "SERVICE_CHARGE"
    | "GAS"
    | "WATER"
    | "ELECTRICITY"
    | "INTERNET"
    | "PENALTY"
    | "PREVIOUS_DUE"
    | "OTHER";

export interface InvoiceLineItem {
    id: string;
    category: LineItemCategory;
    description: string;
    amount: string;
}

// GET /invoices/:id — full detail with tenant, unit (with building), lease, payments
export interface InvoiceDetail extends Invoice {
    tenant: Tenant;
    unit: Unit & { building: Building };
    lease: Lease;
    payments: InvoicePaymentSummary[];
    lineItems: InvoiceLineItem[];
}

export interface GenerateSingleInvoicePayload {
    leaseId: string;
    /** YYYY-MM-DD */
    billingMonth: string;
    utilityAmount?: number;
    penaltyAmount?: number;
}

export interface GenerateMonthlyBatchPayload {
    /** YYYY-MM-DD */
    billingMonth: string;
}

export interface GenerateMonthlyBatchResult {
    createdCount: number;
    skippedCount: number;
}

export interface InvoiceFilters {
    status?: InvoiceStatus;
    leaseId?: string;
    tenantId?: string;
    unitId?: string;
    /** "YYYY-MM" — filters invoices belonging to a specific billing month. */
    billingMonth?: string;
}

/**
 * PATCH /invoices/:id — update due date, penalty, notes, and/or utilities.
 * All fields optional. The backend recomputes totals when amounts change.
 */
export interface UpdateInvoicePayload {
    /** YYYY-MM-DD */
    dueDate?: string;
    penaltyAmount?: number;
    notes?: string | null;
    /** Replace the utilities breakdown — merges with existing on the backend. */
    utilities?: InvoiceUtilities;
}

/** PATCH /invoices/:id/cancel — soft cancels the invoice. */
export interface CancelInvoicePayload {
    reason: string;
}
