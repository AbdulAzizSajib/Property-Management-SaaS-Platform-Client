import type { Organization } from "./organization.types";

export type SubscriptionPlan = "FREE_TRIAL" | "BASIC" | "STANDARD" | "ENTERPRISE";

export type SubscriptionStatus =
    | "TRIALING"
    | "ACTIVE"
    | "PAST_DUE"
    | "CANCELED"
    | "EXPIRED";

export interface Subscription {
    id: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    buildingLimit: number;
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
}

// GET /subscriptions/me returns the subscription with the organization embedded.
export interface SubscriptionWithOrganization extends Subscription {
    organization: Organization;
}

export interface ChangePlanPayload {
    plan: SubscriptionPlan;
}

// Plan presentation metadata for the upgrade UI.
export const PLAN_PRESETS: Record<
    SubscriptionPlan,
    {
        label: string;
        tagline: string;
        priceMonthly: number;
        buildingLimit: number;
        unitLimit: number;
        tenantLimit: number;
        smsEnabled: boolean;
        customBranding: boolean;
        multiAdmin: boolean;
        highlight?: boolean;
    }
> = {
    FREE_TRIAL: {
        label: "Free Trial",
        tagline: "14 days to explore everything",
        priceMonthly: 0,
        buildingLimit: 1,
        unitLimit: 10,
        tenantLimit: 10,
        smsEnabled: false,
        customBranding: false,
        multiAdmin: false,
    },
    BASIC: {
        label: "Basic",
        tagline: "For small landlords",
        priceMonthly: 999,
        buildingLimit: 3,
        unitLimit: 50,
        tenantLimit: 50,
        smsEnabled: false,
        customBranding: false,
        multiAdmin: false,
    },
    STANDARD: {
        label: "Standard",
        tagline: "Most popular for growing portfolios",
        priceMonthly: 2999,
        buildingLimit: 10,
        unitLimit: 200,
        tenantLimit: 200,
        smsEnabled: true,
        customBranding: false,
        multiAdmin: true,
        highlight: true,
    },
    ENTERPRISE: {
        label: "Enterprise",
        tagline: "For real estate companies",
        priceMonthly: 9999,
        buildingLimit: 999,
        unitLimit: 9999,
        tenantLimit: 9999,
        smsEnabled: true,
        customBranding: true,
        multiAdmin: true,
    },
};

export const PLAN_ORDER: SubscriptionPlan[] = [
    "FREE_TRIAL",
    "BASIC",
    "STANDARD",
    "ENTERPRISE",
];
