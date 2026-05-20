import type { Invoice } from "./invoice.types";
import type { Lease } from "./lease.types";
import type { Tenant } from "./tenant.types";

export type PaymentMethod =
    | "CASH"
    | "BKASH"
    | "NAGAD"
    | "ROCKET"
    | "BANK_TRANSFER"
    | "CARD"
    | "CHEQUE"
    | "OTHER";

export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
    { value: "CASH", label: "Cash" },
    { value: "BKASH", label: "bKash" },
    { value: "NAGAD", label: "Nagad" },
    { value: "ROCKET", label: "Rocket" },
    { value: "BANK_TRANSFER", label: "Bank transfer" },
    { value: "CARD", label: "Card" },
    { value: "CHEQUE", label: "Cheque" },
    { value: "OTHER", label: "Other" },
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
    { value: "REFUNDED", label: "Refunded" },
];

// Backend returns Prisma Decimal as a string.
export interface Payment {
    id: string;
    receiptNumber: string;
    amount: string;
    method: PaymentMethod;
    status: PaymentStatus;
    paidAt: string;
    transactionId: string | null;
    isAdvance: boolean;
    notes: string | null;
    receiptUrl: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    invoiceId: string;
    leaseId: string;
    tenantId: string;
    recordedById: string | null;
}

export interface PaymentTenantSummary {
    id: string;
    name: string;
    phone: string;
}

export interface PaymentInvoiceSummary {
    id: string;
    invoiceNumber: string;
}

// GET /payments — list item
export interface PaymentListItem extends Payment {
    tenant: PaymentTenantSummary;
    invoice: PaymentInvoiceSummary;
}

// GET /payments/:id — full detail with embedded tenant + invoice + lease
export interface PaymentDetail extends Payment {
    tenant: Tenant;
    invoice: Invoice;
    lease: Lease;
}

export interface RecordPaymentPayload {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
    notes?: string;
}

export interface PaymentFilters {
    leaseId?: string;
    tenantId?: string;
    invoiceId?: string;
}
