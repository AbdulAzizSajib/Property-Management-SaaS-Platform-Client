import type { Building } from "./building.types";
import type { Lease } from "./lease.types";
import type { Tenant } from "./tenant.types";
import type { Unit } from "./unit.types";

export type InvoiceStatus =
    | "DUE"
    | "PARTIAL"
    | "PAID"
    | "OVERDUE"
    | "CANCELLED"
    | "CARRIED_FORWARD";

export type InvoiceType = "RENT" | "DEPOSIT" | "PENALTY" | "UTILITY" | "OTHER";

export const INVOICE_STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
    { value: "DUE", label: "Due" },
    { value: "PARTIAL", label: "Partial" },
    { value: "PAID", label: "Paid" },
    { value: "OVERDUE", label: "Overdue" },
    { value: "CARRIED_FORWARD", label: "Carried forward" },
    { value: "CANCELLED", label: "Cancelled" },
];

export const INVOICE_TYPE_OPTIONS: { value: InvoiceType; label: string }[] = [
    { value: "RENT", label: "Rent" },
    { value: "DEPOSIT", label: "Deposit" },
    { value: "PENALTY", label: "Penalty" },
    { value: "UTILITY", label: "Utility" },
    { value: "OTHER", label: "Other" },
];

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
    totalAmount: string;
    paidAmount: string;
    dueAmount: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    leaseId: string;
    unitId: string;
    tenantId: string;
    /**
     * Carry-forward link. When this invoice's unpaid balance was rolled into a
     * newer invoice, status becomes "CARRIED_FORWARD" and this points to the
     * invoice that absorbed it.
     */
    carriedForwardToId?: string | null;
    carriedForwardTo?: InvoiceCarryRef | null;
}

/** Lightweight reference to a linked invoice in a carry-forward relationship. */
export interface InvoiceCarryRef {
    id: string;
    invoiceNumber: string;
    billingMonth: string;
    status?: InvoiceStatus;
    /** Present on detail (carriedForwardFrom) so the remaining due can be shown. */
    totalAmount?: string;
    paidAmount?: string;
}

export interface InvoiceTenantSummary {
    id: string;
    name: string;
    phone: string;
    photoUrl: string | null;
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
    payments?: InvoicePaymentSummary[];
    lineItems: InvoiceLineItem[];
    /** Older invoices whose unpaid balances this invoice absorbed. */
    carriedForwardFrom?: InvoiceCarryRef[];
}

export interface GenerateSingleInvoicePayload {
    leaseId: string;
    /** YYYY-MM-DD */
    billingMonth: string;
    /**
     * Earlier unpaid invoices of this lease to roll into this one. Omit / [] to
     * bill only the current month (previous dues stay as their own invoices).
     */
    carryForwardInvoiceIds?: string[];
}

export interface GenerateMonthlyBatchPayload {
    /** YYYY-MM-DD */
    billingMonth: string;
    /** Only bill leases whose unit is in this building. Omit for all buildings. */
    buildingId?: string;
    /** Carry every outstanding balance forward. Defaults to true on the backend. */
    carryForward?: boolean;
}

export interface GenerateMonthlyBatchResult {
    createdCount: number;
    skippedCount: number;
}

export interface InvoiceFilters {
    /**
     * One status, or a comma-separated list (e.g. "DUE,PARTIAL"). The backend
     * splits on commas and matches any of them, so a single GET /invoices call
     * can fetch several statuses at once.
     */
    status?: InvoiceStatus | string;
    leaseId?: string;
    tenantId?: string;
    unitId?: string;
    buildingId?: string;
    /** "YYYY-MM" — filters invoices belonging to a specific billing month. */
    billingMonth?: string;
}

/**
 * PATCH /invoices/:id — update the due date and/or notes. All fields optional.
 */
export interface UpdateInvoicePayload {
    /** YYYY-MM-DD */
    dueDate?: string;
    notes?: string | null;
}

/** PATCH /invoices/:id/cancel — soft cancels the invoice. */
export interface CancelInvoicePayload {
    reason: string;
}
