import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    ChangePlanPayload,
    Plan,
    SubscriptionWithOrganization,
} from "@/src/types/subscription.types";

/**
 * GET /subscriptions/plans
 * Public — returns the plan catalog (displayName, pricing, limits, features).
 */
export const getPlans = async () =>
    httpClient.get<Plan[]>("/subscriptions/plans");

/**
 * GET /subscriptions/me
 * Allowed: OWNER, MANAGER.
 * Returns active subscription for caller's organization
 * (plan, status, limits, trial end date, embedded organization).
 */
export const getMySubscription = async () =>
    httpClient.get<SubscriptionWithOrganization>("/subscriptions/me");

/**
 * PATCH /subscriptions/me/plan
 * Allowed: OWNER only.
 * Plan must be one of FREE_TRIAL, BASIC, STANDARD, ENTERPRISE.
 * Limits, price and status are re-applied from preset on change.
 */
export const changeMyPlan = async (payload: ChangePlanPayload) =>
    httpClient.patch<SubscriptionWithOrganization>("/subscriptions/me/plan", payload);
