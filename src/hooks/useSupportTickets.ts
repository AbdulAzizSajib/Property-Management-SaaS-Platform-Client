"use client";

import {
    addMySupportTicketMessage,
    addSupportTicketMessage,
    createSupportTicket,
    getMySupportTicketById,
    getMySupportTickets,
    getSupportTicketById,
    listAllSupportTickets,
    updateSupportTicketStatus,
} from "@/src/services/supportTicket.services";
import { getErrorMessage } from "@/src/lib/utils";
import type {
    CreateSupportTicketMessagePayload,
    CreateSupportTicketPayload,
    SupportTicketFilters,
    UpdateSupportTicketStatusPayload,
} from "@/src/types/supportTicket.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const supportTicketKeys = {
    all: ["support-tickets"] as const,
    me: (filters?: SupportTicketFilters) =>
        ["support-tickets", "me", filters ?? {}] as const,
    meDetail: (id: string) => ["support-tickets", "me", "detail", id] as const,
    list: (filters?: SupportTicketFilters) =>
        ["support-tickets", "list", filters ?? {}] as const,
    detail: (id: string) => ["support-tickets", "detail", id] as const,
};

// ─── Owner ──────────────────────────────────────────────────────

export function useMySupportTickets(filters?: SupportTicketFilters) {
    return useQuery({
        queryKey: supportTicketKeys.me(filters),
        queryFn: async () => (await getMySupportTickets(filters)).data,
    });
}

export function useMySupportTicket(id: string | undefined) {
    return useQuery({
        queryKey: id
            ? supportTicketKeys.meDetail(id)
            : ["support-tickets", "me", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Ticket id is required");
            return (await getMySupportTicketById(id)).data;
        },
        enabled: !!id,
    });
}

export function useCreateSupportTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateSupportTicketPayload) =>
            (await createSupportTicket(payload)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportTicketKeys.all });
            toast.success("Support ticket submitted");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to submit ticket"));
        },
    });
}

export function useAddMySupportTicketMessage(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateSupportTicketMessagePayload) =>
            (await addMySupportTicketMessage(id, payload)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: supportTicketKeys.meDetail(id),
            });
            queryClient.invalidateQueries({ queryKey: supportTicketKeys.all });
            toast.success("Reply sent");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to send reply"));
        },
    });
}

// ─── Admin ──────────────────────────────────────────────────────

export function useAllSupportTickets(filters?: SupportTicketFilters) {
    return useQuery({
        queryKey: supportTicketKeys.list(filters),
        queryFn: async () => (await listAllSupportTickets(filters)).data,
    });
}

export function useSupportTicket(id: string | undefined) {
    return useQuery({
        queryKey: id
            ? supportTicketKeys.detail(id)
            : ["support-tickets", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Ticket id is required");
            return (await getSupportTicketById(id)).data;
        },
        enabled: !!id,
    });
}

export function useAddSupportTicketMessage(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateSupportTicketMessagePayload) =>
            (await addSupportTicketMessage(id, payload)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: supportTicketKeys.detail(id),
            });
            queryClient.invalidateQueries({ queryKey: supportTicketKeys.all });
            toast.success("Reply sent");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to send reply"));
        },
    });
}

export function useUpdateSupportTicketStatus(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateSupportTicketStatusPayload) =>
            (await updateSupportTicketStatus(id, payload)).data,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: supportTicketKeys.detail(id),
            });
            queryClient.invalidateQueries({ queryKey: supportTicketKeys.all });
            toast.success("Ticket status updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update status"));
        },
    });
}
