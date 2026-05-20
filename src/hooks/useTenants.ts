"use client";

import {
    createTenant,
    deactivateTenant,
    getTenantById,
    getTenants,
    updateTenant,
} from "@/src/services/tenant.services";
import type {
    CreateTenantPayload,
    UpdateTenantPayload,
} from "@/src/types/tenant.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const tenantKeys = {
    all: ["tenants"] as const,
    list: () => [...tenantKeys.all, "list"] as const,
    detail: (id: string) => [...tenantKeys.all, "detail", id] as const,
};

export function useTenants() {
    return useQuery({
        queryKey: tenantKeys.list(),
        queryFn: async () => {
            const res = await getTenants();
            return res.data;
        },
    });
}

export function useTenant(id: string | undefined) {
    return useQuery({
        queryKey: id ? tenantKeys.detail(id) : ["tenants", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Tenant id is required");
            const res = await getTenantById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateTenantPayload) => {
            const res = await createTenant(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tenantKeys.list() });
            toast.success("Tenant created");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to create tenant",
            );
        },
    });
}

export function useUpdateTenant(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateTenantPayload) => {
            const res = await updateTenant(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: tenantKeys.list() });
            toast.success("Tenant updated");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to update tenant",
            );
        },
    });
}

export function useDeactivateTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deactivateTenant(id);
            return id;
        },
        onSuccess: (id) => {
            // Soft delete — keep the detail cache and invalidate so it reflects isActive=false.
            queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: tenantKeys.list() });
            toast.success("Tenant deactivated");
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Failed to deactivate tenant",
            );
        },
    });
}
