"use client";

import { invoiceKeys } from "@/src/hooks/useInvoices";
import { leaseKeys } from "@/src/hooks/useLeases";
import {
    getPaymentById,
    getPayments,
    recordPayment,
} from "@/src/services/payment.services";
import type {
    PaymentFilters,
    RecordPaymentPayload,
} from "@/src/types/payment.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const paymentKeys = {
    all: ["payments"] as const,
    list: (filters?: PaymentFilters) =>
        [...paymentKeys.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
};

export function usePayments(filters?: PaymentFilters) {
    return useQuery({
        queryKey: paymentKeys.list(filters),
        queryFn: async () => {
            const res = await getPayments(filters);
            return res.data;
        },
    });
}

export function usePayment(id: string | undefined) {
    return useQuery({
        queryKey: id ? paymentKeys.detail(id) : ["payments", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Payment id is required");
            const res = await getPaymentById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useRecordPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: RecordPaymentPayload) => {
            const res = await recordPayment(payload);
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
                error instanceof Error
                    ? error.message
                    : "Failed to record payment",
            );
        },
    });
}
