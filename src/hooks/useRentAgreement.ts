"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
    createAgreement,
    getAgreementByLease,
    signAgreement,
} from "@/src/services/rentAgreement.services";
import type {
    CreateRentAgreementPayload,
    SignRentAgreementPayload,
} from "@/src/types/rentAgreement.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const rentAgreementKeys = {
    all: ["rent-agreements"] as const,
    byLease: (leaseId: string) =>
        [...rentAgreementKeys.all, "lease", leaseId] as const,
};

export function useRentAgreement(leaseId: string | undefined) {
    return useQuery({
        queryKey: leaseId
            ? rentAgreementKeys.byLease(leaseId)
            : ["rent-agreements", "lease", "_none"],
        queryFn: async () => {
            if (!leaseId) throw new Error("leaseId is required");
            const res = await getAgreementByLease(leaseId);
            return res.data;
        },
        enabled: !!leaseId,
        // 404 if no agreement yet — surface as null instead of an error toast.
        retry: false,
    });
}

export function useCreateRentAgreement(leaseId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateRentAgreementPayload) => {
            const res = await createAgreement(leaseId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: rentAgreementKeys.byLease(leaseId),
            });
            toast.success("Agreement drafted");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to draft agreement"));
        },
    });
}

export function useSignRentAgreement(leaseId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: SignRentAgreementPayload) => {
            const res = await signAgreement(leaseId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: rentAgreementKeys.byLease(leaseId),
            });
            toast.success("Agreement signed");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to sign agreement"));
        },
    });
}
