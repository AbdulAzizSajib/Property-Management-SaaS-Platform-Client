import type { SubscriptionPlan } from "./subscription.types";

export type SubscriptionRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

/** Billing cycle a subscription request is priced/activated for. */
export type BillingCycle = "MONTHLY" | "YEARLY";

/** Mobile-money / bank methods accepted for manual subscription payments. */
export type RequestPaymentMethod =
    | "BKASH"
    | "NAGAD"
    | "ROCKET"
    | "BANK_TRANSFER";

export const REQUEST_PAYMENT_METHODS: {
    value: RequestPaymentMethod;
    label: string;
}[] = [
    { value: "BKASH", label: "bKash" },
    { value: "NAGAD", label: "Nagad" },
    { value: "ROCKET", label: "Rocket" },
    { value: "BANK_TRANSFER", label: "Bank transfer" },
];

export interface SubscriptionRequest {
    id: string;
    targetPlan: SubscriptionPlan;
    /** Backend returns Prisma Decimal as a string. */
    amount: string;
    method: RequestPaymentMethod;
    senderNumber: string | null;
    transactionId: string | null;
    status: SubscriptionRequestStatus;
    reviewNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    requestedById: string | null;
    reviewedById: string | null;
}

// GET /subscription-requests/all (admin) embeds org + requester.
export interface AdminSubscriptionRequest extends SubscriptionRequest {
    organization: {
        id: string;
        name: string;
        email: string | null;
        slug: string;
    };
    requestedBy: { id: string; name: string; email: string } | null;
}

export interface CreateSubscriptionRequestPayload {
    targetPlan: SubscriptionPlan;
    billingCycle: BillingCycle;
    method: RequestPaymentMethod;
    senderNumber: string;
    transactionId: string;
}

export interface SubscriptionPaymentInfo {
    bkashNumber: string;
    accountType: string;
    instructions: string;
}

export interface ReviewRequestPayload {
    note?: string;
}
