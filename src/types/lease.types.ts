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
    photoUrl: string | null;
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
}

export interface TerminateLeasePayload {
    moveOutDate: string; // YYYY-MM-DD
    notes?: string;
}

// GET /leases — optional filters + pagination. buildingId/floorId scope via
// the unit relation (unit.buildingId / unit.floorId on the backend).
export interface LeaseFilters {
    buildingId?: string;
    floorId?: string;
    unitId?: string;
    tenantId?: string;
    status?: LeaseStatus;
    page?: number;
    limit?: number;
}

// GET /leases/summary — org-wide (or building/floor/unit-scoped) stats,
// independent of pagination. Decimal returned as a string.
export interface LeaseSummary {
    totalCount: number;
    activeCount: number;
    pendingCount: number;
    terminatedCount: number;
    expiredCount: number;
    totalMonthlyRent: string;
}

export interface LeaseSummaryFilters {
    buildingId?: string;
    floorId?: string;
    unitId?: string;
}
