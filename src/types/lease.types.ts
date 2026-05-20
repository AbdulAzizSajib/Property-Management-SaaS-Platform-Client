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
    endDate: string;
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
    endDate: string;
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
