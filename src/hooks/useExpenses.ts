"use client";

import {
    createExpense,
    deleteExpense,
    getExpenseById,
    getExpenses,
    updateExpense,
} from "@/src/services/expense.services";
import type {
    CreateExpensePayload,
    ExpenseFilters,
    UpdateExpensePayload,
} from "@/src/types/expense.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const expenseKeys = {
    all: ["expenses"] as const,
    list: (filters?: ExpenseFilters) =>
        [...expenseKeys.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...expenseKeys.all, "detail", id] as const,
};

export function useExpenses(filters?: ExpenseFilters) {
    return useQuery({
        queryKey: expenseKeys.list(filters),
        queryFn: async () => {
            const res = await getExpenses(filters);
            return res.data;
        },
    });
}

export function useExpense(id: string | undefined) {
    return useQuery({
        queryKey: id ? expenseKeys.detail(id) : ["expenses", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Expense id is required");
            const res = await getExpenseById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateExpensePayload) => {
            const res = await createExpense(payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.all });
            toast.success("Expense recorded");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to record expense"));
        },
    });
}

export function useUpdateExpense(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateExpensePayload) => {
            const res = await updateExpense(id, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: expenseKeys.all });
            toast.success("Expense updated");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to update expense"));
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteExpense(id);
            return id;
        },
        onSuccess: (id) => {
            queryClient.removeQueries({ queryKey: expenseKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: expenseKeys.all });
            toast.success("Expense deleted");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to delete expense"));
        },
    });
}
