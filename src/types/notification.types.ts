export type NotificationStatus = "PENDING" | "READ";

export type NotificationKind =
    | "PAYMENT_RECEIVED"
    | "INVOICE_GENERATED"
    | "INVOICE_DUE"
    | "INVOICE_OVERDUE"
    | "LEASE_EXPIRING"
    | "COMPLAINT_FILED"
    | "COMPLAINT_ASSIGNED"
    | "COMPLAINT_RESOLVED"
    | "RENT_INCREASED"
    | "AGREEMENT_SIGNED"
    | "SUBSCRIPTION_TRIAL_ENDING"
    | "SUBSCRIPTION_EXPIRED"
    | "SYSTEM";

export interface AppNotification {
    id: string;
    type: NotificationKind | string;
    title: string;
    message: string;
    status: NotificationStatus;
    /** Optional deep-link path. */
    actionUrl: string | null;
    /** Free-form JSON metadata. */
    metadata: Record<string, unknown> | null;
    createdAt: string;
    readAt: string | null;
    userId: string;
}

export interface NotificationFilters {
    status?: NotificationStatus;
    limit?: number;
}
