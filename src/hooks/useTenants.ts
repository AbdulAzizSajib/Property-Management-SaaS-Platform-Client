"use client";

import {
    createTenant,
    deactivateTenant,
    getTenantById,
    getTenants,
    updateTenant,
} from "@/src/services/tenant.services";
import { getErrorMessage } from "@/src/lib/utils";
import type { TenantFilters } from "@/src/types/tenant.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const tenantKeys = {
    all: ["tenants"] as const,
    // Base prefix shared by every filter variant — invalidate with this so a
    // mutation refreshes the list regardless of which page/filters are active.
    lists: () => [...tenantKeys.all, "list"] as const,
    list: (filters?: TenantFilters) =>
        [...tenantKeys.lists(), filters ?? {}] as const,
    detail: (id: string) => [...tenantKeys.all, "detail", id] as const,
};

/** Returns { data: TenantListItem[], meta: { page, limit, total, totalPages } }. */
export function useTenants(
    filters?: TenantFilters,
    options?: { enabled?: boolean },
) {
    return useQuery({
        queryKey: tenantKeys.list(filters),
        queryFn: async () => {
            const res = await getTenants(filters);
            return { data: res.data, meta: res.meta };
        },
        enabled: options?.enabled,
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
        mutationFn: async (formData: FormData) => {
            const res = await createTenant(formData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
            toast.success("Tenant created");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to create tenant"),
            );
        },
    });
}

export function useUpdateTenant(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await updateTenant(id, formData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
            toast.success("Tenant updated");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to update tenant"),
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
            queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
            toast.success("Tenant deactivated");
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to deactivate tenant"),
            );
        },
    });
}
