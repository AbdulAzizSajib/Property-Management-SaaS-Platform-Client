import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    CreatePlanConfigPayload,
    PlanConfig,
    UpdatePlanConfigPayload,
} from "@/src/types/planConfig.types";
import type { SubscriptionPlan } from "@/src/types/subscription.types";

/**
 * GET /plan-configs
 * Allowed: SUPER_ADMIN. Returns all plans (active + inactive).
 */
export const getPlanConfigs = async () =>
    httpClient.get<PlanConfig[]>("/plan-configs");

/**
 * GET /plan-configs/:id
 * Allowed: SUPER_ADMIN.
 */
export const getPlanConfigById = async (id: string) =>
    httpClient.get<PlanConfig>(`/plan-configs/${id}`);

/**
 * GET /plan-configs/by-plan/:plan
 * Allowed: SUPER_ADMIN. `plan` is the enum value (FREE_TRIAL, BASIC, ...).
 */
export const getPlanConfigByPlan = async (plan: SubscriptionPlan) =>
    httpClient.get<PlanConfig>(`/plan-configs/by-plan/${plan}`);

/**
 * POST /plan-configs
 * Allowed: SUPER_ADMIN.
 */
export const createPlanConfig = async (payload: CreatePlanConfigPayload) =>
    httpClient.post<PlanConfig>("/plan-configs", payload);

/**
 * PATCH /plan-configs/:id
 * Allowed: SUPER_ADMIN. `plan` itself is immutable; send only fields to change.
 */
export const updatePlanConfig = async (
    id: string,
    payload: UpdatePlanConfigPayload,
) => httpClient.patch<PlanConfig>(`/plan-configs/${id}`, payload);

/**
 * DELETE /plan-configs/:id
 * Allowed: SUPER_ADMIN. Server rejects with 400 if any active subscription
 * references the plan, or if the plan is FREE_TRIAL. Soft-hide via
 * PATCH { isActive: false } instead.
 */
export const deletePlanConfig = async (id: string) =>
    httpClient.delete<{ id: string }>(`/plan-configs/${id}`);
