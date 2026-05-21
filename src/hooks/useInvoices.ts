"use client";

import { leaseKeys } from "@/src/hooks/useLeases";
import {
    generateMonthlyBatch,
    generateSingleInvoice,
    getInvoiceById,
    getInvoices,
} from "@/src/services/invoice.services";
import type {
    GenerateMonthlyBatchPayload,
    GenerateSingleInvoicePayload,
    InvoiceFilters,
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

export function useInvoices(filters?: InvoiceFilters) {
    return useQuery({
        queryKey: invoiceKeys.list(filters),
        queryFn: async () => {
            const res = await getInvoices(filters);
            return res.data;
        },
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
