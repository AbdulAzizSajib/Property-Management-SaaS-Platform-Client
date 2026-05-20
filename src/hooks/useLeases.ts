"use client";

import { buildingKeys } from "@/src/hooks/useBuildings";
import { tenantKeys } from "@/src/hooks/useTenants";
import { unitKeys } from "@/src/hooks/useUnits";
import {
    createLease,
    getLeaseById,
    getLeases,
    terminateLease,
} from "@/src/services/lease.services";
import type {
    CreateLeasePayload,
    TerminateLeasePayload,
} from "@/src/types/lease.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const leaseKeys = {
    all: ["leases"] as const,
    list: () => [...leaseKeys.all, "list"] as const,
    detail: (id: string) => [...leaseKeys.all, "detail", id] as const,
};

export function useLeases() {
    return useQuery({
        queryKey: leaseKeys.list(),
        queryFn: async () => {
            const res = await getLeases();
            return res.data;
        },
    });
}

export function useLease(id: string | undefined) {
    return useQuery({
        queryKey: id ? leaseKeys.detail(id) : ["leases", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Lease id is required");
            const res = await getLeaseById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

/** Creating/terminating a lease affects unit status, tenant lease list, and building counts. */
function invalidateLeaseDependents(
    queryClient: ReturnType<typeof useQueryClient>,
    opts: { unitId?: string; tenantId?: string },
) {
    queryClient.invalidateQueries({ queryKey: leaseKeys.all });
    queryClient.invalidateQueries({ queryKey: unitKeys.all });
    queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    queryClient.invalidateQueries({ queryKey: buildingKeys.all });
    if (opts.unitId) {
        queryClient.invalidateQueries({ queryKey: unitKeys.detail(opts.unitId) });
    }
    if (opts.tenantId) {
        queryClient.invalidateQueries({
            queryKey: tenantKeys.detail(opts.tenantId),
        });
    }
}

export function useCreateLease() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateLeasePayload) => {
            const res = await createLease(payload);
            return res.data;
        },
        onSuccess: (data) => {
            invalidateLeaseDependents(queryClient, {
                unitId: data.unitId,
                tenantId: data.tenantId,
            });
            toast.success("Lease created");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to create lease",
            );
        },
    });
}

export function useTerminateLease(leaseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: TerminateLeasePayload) => {
            const res = await terminateLease(leaseId, payload);
            return res.data;
        },
        onSuccess: (data) => {
            invalidateLeaseDependents(queryClient, {
                unitId: data.unitId,
                tenantId: data.tenantId,
            });
            queryClient.invalidateQueries({ queryKey: leaseKeys.detail(leaseId) });
            toast.success("Lease terminated");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to terminate lease",
            );
        },
    });
}
