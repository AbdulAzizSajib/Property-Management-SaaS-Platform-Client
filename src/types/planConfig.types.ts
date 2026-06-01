// PlanConfig — admin-managed catalog of subscription plans.
// SUPER_ADMIN-only CRUD. Drives the public pricing page and Owner
// subscription picker. `plan` is the immutable enum key; everything
// else is presentational/operational.

import type { SubscriptionPlan } from "./subscription.types";

export interface PlanConfig {
    id: string;
    plan: SubscriptionPlan;
    displayName: string;
    description: string;
    buildingLimit: number;
    floorLimit: number;
    unitLimit: number;
    tenantLimit: number;
    smsEnabled: boolean;
    customBranding: boolean;
    multiAdmin: boolean;
    /** Prisma Decimal — backend returns it as a string. */
    priceMonthly: string;
    trialDays: number | null;
    isPopular: boolean;
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePlanConfigPayload {
    plan: SubscriptionPlan;
    displayName: string;
    description: string;
    buildingLimit: number;
    floorLimit: number;
    unitLimit: number;
    tenantLimit: number;
    priceMonthly: number;
    features: string[];
    smsEnabled?: boolean;
    customBranding?: boolean;
    multiAdmin?: boolean;
    trialDays?: number | null;
    isPopular?: boolean;
    isActive?: boolean;
}

// PATCH — everything optional, plan itself is immutable on the server.
export type UpdatePlanConfigPayload = Partial<
    Omit<CreatePlanConfigPayload, "plan">
>;
