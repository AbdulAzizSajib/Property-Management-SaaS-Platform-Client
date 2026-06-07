"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
    createRentIncrease,
    getRentIncreasesByLease,
} from "@/src/services/rentIncrease.services";
import type { CreateRentIncreasePayload } from "@/src/types/rentIncrease.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const rentIncreaseKeys = {
    all: ["rent-increases"] as const,
    byLease: (leaseId: string) =>
        [...rentIncreaseKeys.all, "lease", leaseId] as const,
};

export function useRentIncreases(leaseId: string | undefined) {
    return useQuery({
        queryKey: leaseId
            ? rentIncreaseKeys.byLease(leaseId)
            : ["rent-increases", "lease", "_none"],
        queryFn: async () => {
            if (!leaseId) throw new Error("leaseId is required");
            const res = await getRentIncreasesByLease(leaseId);
            return res.data;
        },
        enabled: !!leaseId,
    });
}

export function useCreateRentIncrease(leaseId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateRentIncreasePayload) => {
            const res = await createRentIncrease(leaseId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: rentIncreaseKeys.byLease(leaseId),
            });
            queryClient.invalidateQueries({ queryKey: ["leases"] });
            toast.success("Rent increase recorded");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to record rent increase"));
        },
    });
}
