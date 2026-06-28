import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
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
 * Allowed: SUPER_ADMIN. `plan` is the enum value (FREE, BASIC, STANDARD, BUSINESS).
 */
export const getPlanConfigByPlan = async (plan: SubscriptionPlan) =>
    httpClient.get<PlanConfig>(`/plan-configs/by-plan/${plan}`);

/**
 * PATCH /plan-configs/:id
 * Allowed: SUPER_ADMIN. Plans are enum-bound and seeded, so this is the only
 * mutation — edit price / limits / features / isActive. No create or delete.
 */
export const updatePlanConfig = async (
    id: string,
    payload: UpdatePlanConfigPayload,
) => httpClient.patch<PlanConfig>(`/plan-configs/${id}`, payload);
