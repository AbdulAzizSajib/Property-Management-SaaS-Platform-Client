// Activity logs — append-only audit trail of who did what.

export type ActivityAction =
    | "USER_CREATED"
    | "USER_UPDATED"
    | "USER_DELETED"
    | "BUILDING_CREATED"
    | "BUILDING_UPDATED"
    | "BUILDING_DELETED"
    | "FLOOR_CREATED"
    | "FLOOR_UPDATED"
    | "FLOOR_DELETED"
    | "UNIT_CREATED"
    | "UNIT_UPDATED"
    | "UNIT_DELETED"
    | "TENANT_CREATED"
    | "TENANT_UPDATED"
    | "TENANT_DELETED"
    | "LEASE_CREATED"
    | "LEASE_TERMINATED"
    | "INVOICE_GENERATED"
    | "INVOICE_UPDATED"
    | "INVOICE_CANCELLED"
    | "PAYMENT_CREATED"
    | "EXPENSE_CREATED"
    | "EXPENSE_UPDATED"
    | "EXPENSE_DELETED"
    | "COMPLAINT_CREATED"
    | "COMPLAINT_ASSIGNED"
    | "COMPLAINT_UPDATED"
    | "COMPLAINT_DELETED"
    | "AGREEMENT_CREATED"
    | "AGREEMENT_SIGNED"
    | "RENT_INCREASED"
    | "SUBSCRIPTION_CHANGED"
    | "SUBSCRIPTION_CANCELLED"
    | "SUBSCRIPTION_REACTIVATED";

export interface ActivityLog {
    id: string;
    action: ActivityAction | string;
    entityType: string;
    entityId: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: string;
    } | null;
}

export interface ActivityLogFilters {
    userId?: string;
    entityType?: string;
    action?: string;
    from?: string;
    to?: string;
    limit?: number;
}
