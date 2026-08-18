"use client";

import { invoiceKeys } from "@/src/hooks/useInvoices";
import { leaseKeys } from "@/src/hooks/useLeases";
import {
    getCollectionById,
    getCollections,
    getCollectionSummary,
    recordCollection,
} from "@/src/services/payment.services";
import type {
    PaymentFilters,
    PaymentSummaryFilters,
    RecordPaymentPayload,
} from "@/src/types/payment.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const paymentKeys = {
    all: ["payments"] as const,
    // Base prefix shared by every filter variant — invalidate with this so a
    // mutation refreshes the list regardless of which page/filters are active.
    lists: () => [...paymentKeys.all, "list"] as const,
    list: (filters?: PaymentFilters) =>
        [...paymentKeys.lists(), filters ?? {}] as const,
    detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
    summary: (filters?: PaymentSummaryFilters) =>
        [...paymentKeys.all, "summary", filters ?? {}] as const,
};

/** Returns { data: PaymentListItem[], meta: { page, limit, total, totalPages } }. */
export function usePayments(filters?: PaymentFilters) {
    return useQuery({
        queryKey: paymentKeys.list(filters),
        queryFn: async () => {
            const res = await getCollections(filters);
            return { data: res.data, meta: res.meta };
        },
    });
}

/** Org-wide (or building/floor/unit-scoped) stats — not paginated, for hero/KPI cards. */
export function usePaymentSummary(filters?: PaymentSummaryFilters) {
    return useQuery({
        queryKey: paymentKeys.summary(filters),
        queryFn: async () => {
            const res = await getCollectionSummary(filters);
            return res.data;
        },
    });
}

export function usePayment(id: string | undefined) {
    return useQuery({
        queryKey: id ? paymentKeys.detail(id) : ["payments", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Payment id is required");
            const res = await getCollectionById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useRecordPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: RecordPaymentPayload) => {
            const res = await recordCollection(payload);
            return res.data;
        },
        onSuccess: (data) => {
            // Refresh payments
            queryClient.invalidateQueries({ queryKey: paymentKeys.all });
            // The invoice's paidAmount / dueAmount / status change — refresh it.
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            queryClient.invalidateQueries({
                queryKey: invoiceKeys.detail(data.invoiceId),
            });
            // The lease detail page embeds payments[] and invoices[].
            queryClient.invalidateQueries({ queryKey: leaseKeys.all });
            queryClient.invalidateQueries({
                queryKey: leaseKeys.detail(data.leaseId),
            });
            toast.success(
                `Payment of ${Number(data.amount).toLocaleString("en-BD")} recorded`,
            );
        },
        onError: (error: unknown) => {
            toast.error(
                getErrorMessage(error, "Failed to record payment"),
            );
        },
    });
}
