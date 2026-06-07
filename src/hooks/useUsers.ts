"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
    createStaff,
    createTenantUser,
    deleteUser,
    getUserById,
    getUsers,
    updateUser,
} from "@/src/services/user.services";
import type {
    CreateStaffPayload,
    CreateTenantUserPayload,
    UpdateUserPayload,
    UserFilters,
} from "@/src/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const userKeys = {
    all: ["users"] as const,
    list: (filters?: UserFilters) =>
        [...userKeys.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export function useUsers(filters?: UserFilters) {
    return useQuery({
        queryKey: userKeys.list(filters),
        queryFn: async () => {
            const res = await getUsers(filters);
            return res.data;
        },
    });
}

export function useUser(id: string | undefined) {
    return useQuery({
        queryKey: id ? userKeys.detail(id) : ["users", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("User id is required");
            const res = await getUserById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateStaffPayload) => {
            const res = await createStaff(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            toast.success("Staff account created");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to create staff"));
        },
    });
}

export function useCreateTenantUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateTenantUserPayload) => {
            const res = await createTenantUser(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
            toast.success("Tenant created");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to create tenant"));
        },
    });
}

export function useUpdateUser(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateUserPayload) => {
            const res = await updateUser(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            toast.success("User updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update user"));
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await deleteUser(id);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
            toast.success("User deactivated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to deactivate user"));
        },
    });
}
