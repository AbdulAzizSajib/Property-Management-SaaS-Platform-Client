"use client";

import { changeMyPlan, getMySubscription } from "@/src/services/subscription.services";
import type { SubscriptionPlan } from "@/src/types/subscription.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const subscriptionKeys = {
    me: ["subscription", "me"] as const,
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
