"use client";

import {
    assignComplaint,
    createComplaint,
    deleteComplaint,
    getComplaintById,
    getComplaints,
    updateComplaint,
} from "@/src/services/complaint.services";
import type {
    AssignComplaintPayload,
    ComplaintFilters,
    CreateComplaintPayload,
    UpdateComplaintPayload,
} from "@/src/types/complaint.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const complaintKeys = {
    all: ["complaints"] as const,
    list: (filters?: ComplaintFilters) =>
        [...complaintKeys.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...complaintKeys.all, "detail", id] as const,
};

export function useComplaints(filters?: ComplaintFilters) {
    return useQuery({
        queryKey: complaintKeys.list(filters),
        queryFn: async () => {
            const res = await getComplaints(filters);
            return res.data;
        },
    });
}

export function useComplaint(id: string | undefined) {
    return useQuery({
        queryKey: id
            ? complaintKeys.detail(id)
            : ["complaints", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Complaint id is required");
            const res = await getComplaintById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateComplaintPayload) => {
            const res = await createComplaint(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: complaintKeys.all });
            toast.success("Complaint filed");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to file complaint"));
        },
    });
}

export function useUpdateComplaint(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateComplaintPayload) => {
            const res = await updateComplaint(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: complaintKeys.detail(id),
            });
            queryClient.invalidateQueries({ queryKey: complaintKeys.all });
            toast.success("Complaint updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update complaint"));
        },
    });
}

export function useAssignComplaint(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: AssignComplaintPayload) => {
            const res = await assignComplaint(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: complaintKeys.detail(id),
            });
            queryClient.invalidateQueries({ queryKey: complaintKeys.all });
            toast.success("Complaint assigned");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to assign complaint"));
        },
    });
}

export function useDeleteComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteComplaint(id);
            return id;
        },
        onSuccess: (id) => {
            queryClient.removeQueries({ queryKey: complaintKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: complaintKeys.all });
            toast.success("Complaint deleted");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to delete complaint"));
        },
    });
}
