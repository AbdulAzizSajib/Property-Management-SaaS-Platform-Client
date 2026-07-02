"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
    createTenantForm,
    deleteTenantForm,
    getTenantFormById,
    getTenantForms,
    updateTenantForm,
} from "@/src/services/tenantForm.services";
import type {
    CreateTenantFormPayload,
    UpdateTenantFormPayload,
} from "@/src/types/tenantForm.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const tenantFormKeys = {
    all: ["tenant-forms"] as const,
    list: () => [...tenantFormKeys.all, "list"] as const,
    detail: (id: string) => [...tenantFormKeys.all, "detail", id] as const,
};

export function useTenantForms() {
    return useQuery({
        queryKey: tenantFormKeys.list(),
        queryFn: async () => {
            const res = await getTenantForms();
            return res.data;
        },
    });
}

export function useTenantForm(id: string | undefined) {
    return useQuery({
        queryKey: id
            ? tenantFormKeys.detail(id)
            : ["tenant-forms", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Tenant form id is required");
            const res = await getTenantFormById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateTenantForm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateTenantFormPayload) => {
            const res = await createTenantForm(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tenantFormKeys.list() });
            toast.success("Tenant form created");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to create tenant form"));
        },
    });
}

export function useUpdateTenantForm(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateTenantFormPayload) => {
            const res = await updateTenantForm(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: tenantFormKeys.detail(id),
            });
            queryClient.invalidateQueries({ queryKey: tenantFormKeys.list() });
            toast.success("Tenant form updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update tenant form"));
        },
    });
}

export function useDeleteTenantForm() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteTenantForm(id);
            return id;
        },
        onSuccess: (id) => {
            queryClient.removeQueries({ queryKey: tenantFormKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: tenantFormKeys.list() });
            toast.success("Tenant form deleted");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to delete tenant form"));
        },
    });
}
