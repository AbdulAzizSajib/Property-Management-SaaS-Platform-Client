import type { Organization } from "./organization.types";

export type SubscriptionPlan = "FREE" | "BASIC" | "STANDARD" | "BUSINESS";

export type SubscriptionStatus =
    | "TRIALING"
    | "ACTIVE"
    | "PAST_DUE"
    | "CANCELLED"
    | "EXPIRED";

/**
 * The user's currently-active subscription record.
 * Limits here are a snapshot of what the user is paying for — they may differ
 * from the catalog defaults in `Plan` because they were captured at purchase time.
 */
export interface Subscription {
    id: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    buildingLimit: number;
    floorLimit: number;
    unitLimit: number;
    tenantLimit: number;
    smsEnabled: boolean;
    customBranding: boolean;
    multiAdmin: boolean;
    /** Backend returns Prisma Decimal as a string. */
    priceMonthly: string;
    trialEndsAt: string | null;
    startDate: string;
    endDate: string | null;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    /** Plan's catalog display name (e.g. "Professional"). */
    planName?: string;
    /** Live usage against the plan limits. */
    usage?: {
        buildings: number;
        floors: number;
        units: number;
        tenants: number;
    };
}

// GET /subscriptions/me returns the subscription with the organization embedded.
export interface SubscriptionWithOrganization extends Subscription {
    organization: Organization;
}

export interface ChangePlanPayload {
    plan: SubscriptionPlan;
}

// Admin override — set plan/status on any organization's subscription.
export interface AdminUpdateSubscriptionPayload {
    plan?: SubscriptionPlan;
    status?: SubscriptionStatus;
    autoRenew?: boolean;
    endDate?: string | null;
}

/**
 * A plan from the catalog (GET /subscriptions/plans).
 * Source of truth for the upgrade UI — no more hardcoded presets.
 */
export interface Plan {
    plan: SubscriptionPlan;
    displayName: string;
    description: string;
    /** Backend returns Prisma Decimal as a string. */
    priceMonthly: string;
    buildingLimit: number;
    floorLimit: number;
    unitLimit: number;
    tenantLimit: number;
    smsEnabled: boolean;
    customBranding: boolean;
    multiAdmin: boolean;
    isPopular: boolean;
    features: string[];
}

export const PLAN_ORDER: SubscriptionPlan[] = [
    "FREE",
    "BASIC",
    "STANDARD",
    "BUSINESS",
];
