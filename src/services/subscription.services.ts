import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    AdminUpdateSubscriptionPayload,
    ChangePlanPayload,
    Plan,
    Subscription,
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

/** POST /subscriptions/me/cancel — OWNER only. */
export const cancelMySubscription = async () =>
    httpClient.post<SubscriptionWithOrganization>(
        "/subscriptions/me/cancel",
        {},
    );

/** POST /subscriptions/me/reactivate — OWNER only. */
export const reactivateMySubscription = async () =>
    httpClient.post<SubscriptionWithOrganization>(
        "/subscriptions/me/reactivate",
        {},
    );

/** GET /subscriptions — SUPER_ADMIN only. All organization subscriptions. */
export const listAllSubscriptions = async () =>
    httpClient.get<SubscriptionWithOrganization[]>("/subscriptions");

/**
 * PATCH /subscriptions/:organizationId
 * SUPER_ADMIN only. Manually override plan/status/etc. on any organization.
 */
export const adminUpdateSubscription = async (
    organizationId: string,
    payload: AdminUpdateSubscriptionPayload,
) =>
    httpClient.patch<Subscription>(
        `/subscriptions/${organizationId}`,
        payload,
    );
