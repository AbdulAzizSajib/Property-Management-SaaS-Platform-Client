"use client";

import {
    approveSubscriptionRequest,
    createSubscriptionRequest,
    getMySubscriptionRequests,
    getSubscriptionPaymentInfo,
    listSubscriptionRequests,
    rejectSubscriptionRequest,
} from "@/src/services/subscriptionRequest.services";
import { getErrorMessage } from "@/src/lib/utils";
import type {
    CreateSubscriptionRequestPayload,
    ReviewRequestPayload,
    SubscriptionRequestStatus,
} from "@/src/types/subscriptionRequest.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { subscriptionKeys } from "./useSubscription";

export const subscriptionRequestKeys = {
    all: ["subscription-requests"] as const,
    me: ["subscription-requests", "me"] as const,
    paymentInfo: ["subscription-requests", "payment-info"] as const,
    list: (status?: SubscriptionRequestStatus) =>
        ["subscription-requests", "list", status ?? "ALL"] as const,
};

export function useSubscriptionPaymentInfo() {
    return useQuery({
        queryKey: subscriptionRequestKeys.paymentInfo,
        queryFn: async () => (await getSubscriptionPaymentInfo()).data,
        staleTime: 5 * 60 * 1000,
    });
}

export function useMySubscriptionRequests() {
    return useQuery({
        queryKey: subscriptionRequestKeys.me,
        queryFn: async () => (await getMySubscriptionRequests()).data,
    });
}

export function useCreateSubscriptionRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateSubscriptionRequestPayload) =>
            (await createSubscriptionRequest(payload)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: subscriptionRequestKeys.me,
            });
            toast.success("Payment request submitted — pending verification");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to submit request"));
        },
    });
}

// ─── Admin ──────────────────────────────────────────────────────

export function useSubscriptionRequests(status?: SubscriptionRequestStatus) {
    return useQuery({
        queryKey: subscriptionRequestKeys.list(status),
        queryFn: async () => (await listSubscriptionRequests(status)).data,
    });
}

export function useApproveSubscriptionRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: ReviewRequestPayload;
        }) => (await approveSubscriptionRequest(id, payload)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: subscriptionRequestKeys.all,
            });
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
            toast.success("Request approved — plan activated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to approve request"));
        },
    });
}

export function useRejectSubscriptionRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: ReviewRequestPayload;
        }) => (await rejectSubscriptionRequest(id, payload)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: subscriptionRequestKeys.all,
            });
            toast.success("Request rejected");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to reject request"));
        },
    });
}
