"use client";

import {
    adminUpdateSubscription,
    cancelMySubscription,
    changeMyPlan,
    getMySubscription,
    getPlans,
    listAllSubscriptions,
    reactivateMySubscription,
} from "@/src/services/subscription.services";
import type {
    AdminUpdateSubscriptionPayload,
    SubscriptionPlan,
} from "@/src/types/subscription.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const subscriptionKeys = {
    me: ["subscription", "me"] as const,
    plans: ["subscription", "plans"] as const,
    all: ["subscriptions", "all"] as const,
};

export function useSubscription() {
    return useQuery({
        queryKey: subscriptionKeys.me,
        queryFn: async () => {
            const res = await getMySubscription();
            return res.data;
        },
    });
}

export function usePlans() {
    return useQuery({
        queryKey: subscriptionKeys.plans,
        queryFn: async () => {
            const res = await getPlans();
            return res.data;
        },
        // Plans rarely change — cache aggressively.
        staleTime: 5 * 60 * 1000,
    });
}

export function useChangePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (plan: SubscriptionPlan) => {
            const res = await changeMyPlan({ plan });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(subscriptionKeys.me, data);
            // Org page embeds the subscription, so refetch it too.
            queryClient.invalidateQueries({ queryKey: ["organization", "me"] });
            toast.success(`Plan changed to ${data.plan.replace("_", " ")}`);
        },
        onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Failed to change plan"));
        },
    });
}

export function useCancelSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await cancelMySubscription();
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(subscriptionKeys.me, data);
            queryClient.invalidateQueries({ queryKey: ["organization", "me"] });
            toast.success("Subscription cancelled");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to cancel subscription"));
        },
    });
}

export function useReactivateSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await reactivateMySubscription();
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(subscriptionKeys.me, data);
            queryClient.invalidateQueries({ queryKey: ["organization", "me"] });
            toast.success("Subscription reactivated");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to reactivate subscription"),
            );
        },
    });
}

// ─── Admin (SUPER_ADMIN) ───────────────────────────────────────

export function useAllSubscriptions() {
    return useQuery({
        queryKey: subscriptionKeys.all,
        queryFn: async () => {
            const res = await listAllSubscriptions();
            return res.data;
        },
    });
}

export function useAdminUpdateSubscription(organizationId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: AdminUpdateSubscriptionPayload) => {
            const res = await adminUpdateSubscription(organizationId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
            toast.success("Subscription updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update subscription"));
        },
    });
}
