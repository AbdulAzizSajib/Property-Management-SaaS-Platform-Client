import type { Building } from "./building.types";
import type { Floor } from "./floor.types";
import type { Tenant } from "./tenant.types";
import type { Unit } from "./unit.types";

export type LeaseStatus =
    | "ACTIVE"
    | "PENDING"
    | "TERMINATED"
    | "EXPIRED"
    | "RENEWED";

export const LEASE_STATUS_OPTIONS: { value: LeaseStatus; label: string }[] = [
    { value: "ACTIVE", label: "Active" },
    { value: "PENDING", label: "Pending" },
    { value: "TERMINATED", label: "Terminated" },
    { value: "EXPIRED", label: "Expired" },
    { value: "RENEWED", label: "Renewed" },
];

/**
 * INCLUSIVE   → one bundled rent (no separate utility line items).
 * FIXED_SEPARATE → rent + service charge + fixed gas/water/electric/internet each month.
 */
export type BillingMode = "INCLUSIVE" | "FIXED_SEPARATE";

export const BILLING_MODE_OPTIONS: {
    value: BillingMode;
    label: string;
    description: string;
}[] = [
    {
        value: "INCLUSIVE",
        label: "Inclusive",
        description:
            "Everything bundled into rent — no separate utility bills.",
    },
    {
        value: "FIXED_SEPARATE",
        label: "Fixed separate",
        description:
            "Rent + service charge + fixed monthly utilities (gas, water, electricity, internet).",
    },
];

// Backend returns Prisma Decimal as a string.
export interface Lease {
    id: string;
    status: LeaseStatus;
    startDate: string;
    /** Null for open-ended / month-to-month leases. */
    endDate: string | null;
    moveInDate: string;
    moveOutDate: string | null;
    monthlyRent: string;
    serviceCharge: string;
    securityDeposit: string;
    advanceBalance: string;
    rentDueDay: number;
    notes: string | null;
    /** Defaults to INCLUSIVE on the backend; included on every response. */
    billingMode: BillingMode;
    /** Only present (non-zero) when billingMode === "FIXED_SEPARATE". Decimal strings. */
    gasCharge: string;
    waterCharge: string;
    electricityCharge: string;
    internetCharge: string;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    unitId: string;
    tenantId: string;
}

export interface LeaseTenantSummary {
    id: string;
    name: string;
    phone: string;
}

export interface LeaseUnitSummary {
    id: string;
    name: string;
    building: {
        id: string;
        name: string;
    };
}

// GET /leases — list item
export interface LeaseListItem extends Lease {
    tenant: LeaseTenantSummary;
    unit: LeaseUnitSummary;
    // Outstanding rollup across the tenant's unpaid invoices on this lease.
    // Decimal string; present on the list endpoint.
    totalDue?: string;
    dueInvoiceCount?: number;
    hasPreviousDue?: boolean;
}

export interface LeaseInvoice {
    id: string;
    invoiceNumber: string;
    type: string;
    status: string;
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
    createdAt: string;
    updatedAt: string;
    leaseId: string;
    unitId: string;
    tenantId: string;
    organizationId: string;
}

export interface LeasePayment {
    id: string;
    amount: string;
    method: string;
    transactionId: string | null;
    notes: string | null;
    createdAt: string;
    invoiceId: string;
    leaseId: string;
}

// GET /leases/:id — full detail with embedded tenant + unit (full Building + Floor) + invoices + payments
export interface LeaseDetail extends Lease {
    tenant: Tenant;
    unit: Unit & {
        building: Building;
        floor: Floor;
    };
    invoices: LeaseInvoice[];
    payments: LeasePayment[];
}

export interface CreateLeasePayload {
    tenantId: string;
    unitId: string;
    startDate: string; // YYYY-MM-DD
    /** Optional — leave undefined for open-ended / month-to-month leases. */
    endDate?: string;
    moveInDate: string;
    monthlyRent: number;
    serviceCharge: number;
    securityDeposit: number;
    rentDueDay: number;
    /** Defaults to INCLUSIVE on the backend if omitted. */
    billingMode?: BillingMode;
    /** Only sent when billingMode === "FIXED_SEPARATE". */
    gasCharge?: number;
    waterCharge?: number;
    electricityCharge?: number;
    internetCharge?: number;
}

export interface TerminateLeasePayload {
    moveOutDate: string; // YYYY-MM-DD
    notes?: string;
}
