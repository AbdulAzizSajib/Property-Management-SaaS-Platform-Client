"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
    createPlanConfig,
    deletePlanConfig,
    getPlanConfigById,
    getPlanConfigByPlan,
    getPlanConfigs,
    updatePlanConfig,
} from "@/src/services/planConfig.services";
import type {
    CreatePlanConfigPayload,
    UpdatePlanConfigPayload,
} from "@/src/types/planConfig.types";
import type { SubscriptionPlan } from "@/src/types/subscription.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const planConfigKeys = {
    all: ["plan-configs"] as const,
    list: () => [...planConfigKeys.all, "list"] as const,
    detail: (id: string) => [...planConfigKeys.all, "detail", id] as const,
    byPlan: (plan: SubscriptionPlan) =>
        [...planConfigKeys.all, "by-plan", plan] as const,
};

export function usePlanConfigs() {
    return useQuery({
        queryKey: planConfigKeys.list(),
        queryFn: async () => {
            const res = await getPlanConfigs();
            return res.data;
        },
    });
}

export function usePlanConfig(id: string | undefined) {
    return useQuery({
        queryKey: id
            ? planConfigKeys.detail(id)
            : ["plan-configs", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Plan config id is required");
            const res = await getPlanConfigById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function usePlanConfigByPlan(plan: SubscriptionPlan | undefined) {
    return useQuery({
        queryKey: plan
            ? planConfigKeys.byPlan(plan)
            : ["plan-configs", "by-plan", "_none"],
        queryFn: async () => {
            if (!plan) throw new Error("Plan is required");
            const res = await getPlanConfigByPlan(plan);
            return res.data;
        },
        enabled: !!plan,
    });
}

export function useCreatePlanConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreatePlanConfigPayload) => {
            const res = await createPlanConfig(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: planConfigKeys.all });
            toast.success("Plan created");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to create plan"));
        },
    });
}

export function useUpdatePlanConfig(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdatePlanConfigPayload) => {
            const res = await updatePlanConfig(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: planConfigKeys.all });
            toast.success("Plan updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update plan"));
        },
    });
}

export function useDeletePlanConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deletePlanConfig(id);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: planConfigKeys.all });
            toast.success("Plan deleted");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(
                    error,
                    "Failed to delete plan. Soft-hide with Disable instead.",
                ),
            );
        },
    });
}
