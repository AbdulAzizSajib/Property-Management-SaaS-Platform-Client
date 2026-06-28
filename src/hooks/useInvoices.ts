"use client";

import { leaseKeys } from "@/src/hooks/useLeases";
import {
    cancelInvoice,
    deleteInvoice,
    generateMonthlyBatch,
    generateSingleInvoice,
    getInvoiceById,
    getInvoices,
    updateInvoice,
} from "@/src/services/invoice.services";
import type {
    CancelInvoicePayload,
    GenerateMonthlyBatchPayload,
    GenerateSingleInvoicePayload,
    InvoiceFilters,
    UpdateInvoicePayload,
} from "@/src/types/invoice.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const invoiceKeys = {
    all: ["invoices"] as const,
    list: (filters?: InvoiceFilters) =>
        [...invoiceKeys.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...invoiceKeys.all, "detail", id] as const,
};

export function useInvoices(
    filters?: InvoiceFilters,
    options?: { enabled?: boolean },
) {
    return useQuery({
        queryKey: invoiceKeys.list(filters),
        queryFn: async () => {
            const res = await getInvoices(filters);
            return res.data;
        },
        enabled: options?.enabled ?? true,
    });
}

export function useInvoice(id: string | undefined) {
    return useQuery({
        queryKey: id ? invoiceKeys.detail(id) : ["invoices", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Invoice id is required");
            const res = await getInvoiceById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useGenerateSingleInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: GenerateSingleInvoicePayload) => {
            const res = await generateSingleInvoice(payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            // The lease detail page embeds invoices[], so refresh it too.
            queryClient.invalidateQueries({ queryKey: leaseKeys.detail(data.leaseId) });
            queryClient.invalidateQueries({ queryKey: leaseKeys.list() });
            toast.success(`Invoice ${data.invoiceNumber} generated`);
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to generate invoice"),
            );
        },
    });
}

export function useGenerateMonthlyBatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: GenerateMonthlyBatchPayload) => {
            const res = await generateMonthlyBatch(payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            queryClient.invalidateQueries({ queryKey: leaseKeys.all });
            if (data.createdCount === 0 && data.skippedCount > 0) {
                toast.info(
                    `No new invoices — ${data.skippedCount} already existed for that month`,
                );
            } else {
                toast.success(
                    `Generated ${data.createdCount} invoice${data.createdCount === 1 ? "" : "s"}, skipped ${data.skippedCount}`,
                );
            }
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to generate monthly batch"),
            );
        },
    });
}

export function useUpdateInvoice(invoiceId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateInvoicePayload) => {
            const res = await updateInvoice(invoiceId, payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: invoiceKeys.detail(invoiceId),
            });
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            // Lease detail embeds invoices[] — recalculated totals + status need refresh.
            queryClient.invalidateQueries({
                queryKey: leaseKeys.detail(data.leaseId),
            });
            toast.success("Invoice updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update invoice"));
        },
    });
}

export function useCancelInvoice(invoiceId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CancelInvoicePayload) => {
            const res = await cancelInvoice(invoiceId, payload);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: invoiceKeys.detail(invoiceId),
            });
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            queryClient.invalidateQueries({
                queryKey: leaseKeys.detail(data.leaseId),
            });
            toast.success("Invoice canceled");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to cancel invoice"));
        },
    });
}

export function useDeleteInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            invoiceId,
        }: {
            invoiceId: string;
            leaseId: string;
        }) => {
            await deleteInvoice(invoiceId);
            return invoiceId;
        },
        onSuccess: (invoiceId, variables) => {
            queryClient.removeQueries({
                queryKey: invoiceKeys.detail(invoiceId),
            });
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            queryClient.invalidateQueries({
                queryKey: leaseKeys.detail(variables.leaseId),
            });
            toast.success("Invoice deleted");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to delete invoice"));
        },
    });
}
